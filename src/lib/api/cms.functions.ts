import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  sanityWriteClient,
  sanityReadClient,
  DEFAULT_POSTS,
  DEFAULT_SETTINGS,
  DEFAULT_ABOUT_SETTINGS,
  DEFAULT_SERVICES
} from "../sanity";
import {
  addLocalWaitlist,
  addLocalContact,
  readLocalSubmissions,
  deleteLocalWaitlist,
  deleteLocalContact,
  markLocalContactRead,
  saveLocalBlogPost,
  deleteLocalBlogPost,
  saveLocalSettings,
  saveLocalAboutSettings,
  saveLocalService,
  deleteLocalService,
} from "../submissions.server";

// Define the password used for the CMS. If ADMIN_PASSWORD env is set, use it. Else default to admin123
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

// Helper validation for admin token
function authorize(token: string) {
  if (token !== "authenticated-admin-session") {
    throw new Error("Unauthorized");
  }
}

// 1. PUBLIC: Add to Waitlist
export const addToWaitlist = createServerFn({ method: "POST" })
  .inputValidator(z.object({ email: z.string().email() }))
  .handler(async ({ data }) => {
    const { email } = data;
    try {
      if (sanityWriteClient) {
        await sanityWriteClient.create({
          _type: "waitlist",
          email,
          createdAt: new Date().toISOString(),
        });
        return { success: true, message: "Added to waitlist on Sanity" };
      } else {
        // Fallback to local DB
        await addLocalWaitlist(email);
        return { success: true, message: "Added to waitlist locally (Sanity unconfigured)" };
      }
    } catch (error) {
      console.error("Error adding to waitlist:", error);
      throw new Error("Failed to register. Please try again.");
    }
  });

// 2. PUBLIC: Submit Contact Form
export const submitContact = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      first: z.string().min(1),
      last: z.string().min(1),
      email: z.string().email(),
      topic: z.string().optional(),
      restaurant: z.string().optional(),
      city: z.string().optional(),
      locations: z.string().optional(),
      message: z.string().min(5),
    })
  )
  .handler(async ({ data }) => {
    try {
      if (sanityWriteClient) {
        await sanityWriteClient.create({
          _type: "contact",
          first: data.first,
          last: data.last,
          email: data.email,
          topic: data.topic || "general",
          restaurant: data.restaurant || "",
          city: data.city || "",
          locations: data.locations || "",
          message: data.message,
          read: false,
          createdAt: new Date().toISOString(),
        });
        return { success: true, message: "Contact inquiry sent to Sanity" };
      } else {
        // Fallback to local DB
        await addLocalContact({
          first: data.first,
          last: data.last,
          email: data.email,
          topic: data.topic,
          restaurant: data.restaurant,
          city: data.city,
          locations: data.locations,
          message: data.message,
        });
        return { success: true, message: "Contact inquiry sent locally (Sanity unconfigured)" };
      }
    } catch (error) {
      console.error("Error submitting contact:", error);
      throw new Error("Failed to send message. Please try again.");
    }
  });

// 3. ADMIN: Validate Password Login
export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator(z.object({ password: z.string() }))
  .handler(async ({ data }) => {
    if (data.password === ADMIN_PASSWORD) {
      return { success: true, token: "authenticated-admin-session" };
    }
    return { success: false, message: "Invalid credentials" };
  });

// 4. ADMIN: Retrieve All Dashboard Data
export const getSubmissions = createServerFn({ method: "POST" })
  .inputValidator(z.object({ token: z.string() }))
  .handler(async ({ data }) => {
    authorize(data.token);

    try {
      if (sanityWriteClient || sanityReadClient) {
        const client = sanityWriteClient || sanityReadClient;

        // Fetch waitlists, contacts, posts, settings, aboutSettings, and services in parallel
        const [waitlist, contacts, posts, settings, aboutSettings, services] = await Promise.all([
          client!.fetch(`*[_type == "waitlist"] | order(createdAt desc) {
            _id,
            email,
            createdAt
          }`),
          client!.fetch(`*[_type == "contact"] | order(createdAt desc) {
            _id,
            first,
            last,
            email,
            topic,
            restaurant,
            city,
            locations,
            message,
            read,
            createdAt
          }`),
          client!.fetch(`*[_type == "post"] | order(date desc) {
            _id,
            title,
            excerpt,
            category,
            date,
            read,
            featured,
            content
          }`),
          client!.fetch(`*[_type == "siteSettings"][0] {
            heroTitleLine1,
            heroTitleLine2,
            heroDescription,
            heroImageLeft,
            heroImageCenter,
            heroImageRight,
            showcaseBanner
          }`),
          client!.fetch(`*[_type == "aboutPage"][0] {
            eyebrow,
            titleLine1,
            titleLine2,
            description,
            missionTitle,
            missionBody,
            visionTitle,
            visionBody,
            problemEyebrow,
            problemTitleLine1,
            problemTitleLine2,
            problemItems,
            whyEyebrow,
            whyTitleLine1,
            whyTitleLine2,
            whyDescription,
            aboutImage
          }`),
          client!.fetch(`*[_type == "service"] | order(order asc) {
            _id,
            title,
            tagline,
            icon,
            bullets,
            useCase,
            image,
            order
          }`)
        ]);

        return {
          waitlist: waitlist.map((w: any) => ({ id: w._id, email: w.email, createdAt: w.createdAt })),
          contacts: contacts.map((c: any) => ({
            id: c._id,
            first: c.first,
            last: c.last,
            email: c.email,
            topic: c.topic,
            restaurant: c.restaurant,
            city: c.city,
            locations: c.locations,
            message: c.message,
            read: c.read,
            createdAt: c.createdAt,
          })),
          posts: posts.map((p: any) => ({
            id: p._id,
            title: p.title,
            excerpt: p.excerpt,
            category: p.category,
            date: p.date,
            read: p.read,
            featured: p.featured,
            content: p.content
          })),
          settings: settings || DEFAULT_SETTINGS,
          aboutSettings: aboutSettings || DEFAULT_ABOUT_SETTINGS,
          services: services && services.length > 0 ? services.map((s: any) => ({
            id: s._id,
            title: s.title,
            tagline: s.tagline,
            icon: s.icon,
            bullets: s.bullets,
            useCase: s.useCase,
            image: s.image,
            order: s.order
          })) : DEFAULT_SERVICES
        };
      } else {
        // Fallback to local DB
        const localData = await readLocalSubmissions();
        return {
          waitlist: localData.waitlist,
          contacts: localData.contacts,
          posts: localData.posts || DEFAULT_POSTS,
          settings: localData.settings || DEFAULT_SETTINGS,
          aboutSettings: localData.aboutSettings || DEFAULT_ABOUT_SETTINGS,
          services: localData.services || DEFAULT_SERVICES
        };
      }
    } catch (error) {
      console.error("Error retrieving submissions:", error);
      throw new Error("Failed to retrieve submissions.");
    }
  });

// 5. ADMIN: Delete Waitlist Entry
export const deleteWaitlistEntry = createServerFn({ method: "POST" })
  .inputValidator(z.object({ token: z.string(), id: z.string() }))
  .handler(async ({ data }) => {
    authorize(data.token);

    try {
      if (sanityWriteClient) {
        await sanityWriteClient.delete(data.id);
        return { success: true };
      } else {
        const deleted = await deleteLocalWaitlist(data.id);
        return { success: deleted };
      }
    } catch (error) {
      console.error("Error deleting waitlist entry:", error);
      throw new Error("Failed to delete entry.");
    }
  });

// 6. ADMIN: Delete Contact Submission
export const deleteContactSubmission = createServerFn({ method: "POST" })
  .inputValidator(z.object({ token: z.string(), id: z.string() }))
  .handler(async ({ data }) => {
    authorize(data.token);

    try {
      if (sanityWriteClient) {
        await sanityWriteClient.delete(data.id);
        return { success: true };
      } else {
        const deleted = await deleteLocalContact(data.id);
        return { success: deleted };
      }
    } catch (error) {
      console.error("Error deleting contact submission:", error);
      throw new Error("Failed to delete submission.");
    }
  });

// 7. ADMIN: Mark Contact Message as Read
export const markContactMessageRead = createServerFn({ method: "POST" })
  .inputValidator(z.object({ token: z.string(), id: z.string() }))
  .handler(async ({ data }) => {
    authorize(data.token);

    try {
      if (sanityWriteClient) {
        await sanityWriteClient.patch(data.id).set({ read: true }).commit();
        return { success: true };
      } else {
        const updated = await markLocalContactRead(data.id);
        return { success: updated };
      }
    } catch (error) {
      console.error("Error updating contact read state:", error);
      throw new Error("Failed to update status.");
    }
  });

// 8. ADMIN: Save/Update Blog Post
export const saveBlogPost = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      token: z.string(),
      id: z.string().optional(),
      title: z.string().min(1),
      excerpt: z.string().min(1),
      category: z.string(),
      date: z.string(),
      read: z.string(),
      featured: z.boolean(),
      content: z.string(), // plain text textarea from editor
    })
  )
  .handler(async ({ data }) => {
    authorize(data.token);
    const { id, title, excerpt, category, date, read, featured, content } = data;

    // Convert flat string content to Sanity Portable Text block format
    const blockContent = [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: content,
          },
        ],
      },
    ];

    const postData = {
      title,
      excerpt,
      category,
      date,
      read,
      featured,
      content: blockContent,
    };

    try {
      if (sanityWriteClient) {
        if (id) {
          await sanityWriteClient.patch(id).set(postData).commit();
          return { success: true, message: "Updated post in Sanity" };
        } else {
          await sanityWriteClient.create({
            _type: "post",
            ...postData,
          });
          return { success: true, message: "Created post in Sanity" };
        }
      } else {
        // Fallback to local DB
        const saved = await saveLocalBlogPost({
          id,
          title,
          excerpt,
          category,
          date,
          read,
          featured,
          content: blockContent,
        });
        return { success: true, data: saved, message: "Saved post locally" };
      }
    } catch (error) {
      console.error("Error saving blog post:", error);
      throw new Error("Failed to save blog post.");
    }
  });

// 9. ADMIN: Delete Blog Post
export const deleteBlogPost = createServerFn({ method: "POST" })
  .inputValidator(z.object({ token: z.string(), id: z.string() }))
  .handler(async ({ data }) => {
    authorize(data.token);

    try {
      if (sanityWriteClient) {
        await sanityWriteClient.delete(data.id);
        return { success: true };
      } else {
        const deleted = await deleteLocalBlogPost(data.id);
        return { success: deleted };
      }
    } catch (error) {
      console.error("Error deleting blog post:", error);
      throw new Error("Failed to delete blog post.");
    }
  });

// 10. ADMIN: Save/Update Site Settings
export const saveSiteSettings = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      token: z.string(),
      heroTitleLine1: z.string().min(1),
      heroTitleLine2: z.string().min(1),
      heroDescription: z.string().min(1),
    })
  )
  .handler(async ({ data }) => {
    authorize(data.token);
    const { heroTitleLine1, heroTitleLine2, heroDescription } = data;
    const settingsData = { heroTitleLine1, heroTitleLine2, heroDescription };

    try {
      if (sanityWriteClient) {
        const existing = await sanityWriteClient.fetch(`*[_type == "siteSettings"][0] { _id }`);
        if (existing?._id) {
          await sanityWriteClient.patch(existing._id).set(settingsData).commit();
        } else {
          await sanityWriteClient.create({
            _type: "siteSettings",
            ...settingsData,
          });
        }
        return { success: true, message: "Updated site settings in Sanity" };
      } else {
        await saveLocalSettings(settingsData);
        return { success: true, message: "Updated settings locally" };
      }
    } catch (error) {
      console.error("Error saving site settings:", error);
      throw new Error("Failed to save site settings.");
    }
  });

// 11. ADMIN: Save/Update About Settings
export const saveAboutSettings = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      token: z.string(),
      eyebrow: z.string().min(1),
      titleLine1: z.string().min(1),
      titleLine2: z.string().min(1),
      description: z.string().min(1),
      missionTitle: z.string().min(1),
      missionBody: z.string().min(1),
      visionTitle: z.string().min(1),
      visionBody: z.string().min(1),
      problemEyebrow: z.string().min(1),
      problemTitleLine1: z.string().min(1),
      problemTitleLine2: z.string().min(1),
      problemItems: z.array(z.string()),
      whyEyebrow: z.string().min(1),
      whyTitleLine1: z.string().min(1),
      whyTitleLine2: z.string().min(1),
      whyDescription: z.string().min(1),
    })
  )
  .handler(async ({ data }) => {
    authorize(data.token);
    const { token, ...aboutData } = data;

    try {
      if (sanityWriteClient) {
        const existing = await sanityWriteClient.fetch(`*[_type == "aboutPage"][0] { _id }`);
        if (existing?._id) {
          await sanityWriteClient.patch(existing._id).set(aboutData).commit();
        } else {
          await sanityWriteClient.create({
            _type: "aboutPage",
            ...aboutData,
          });
        }
        return { success: true, message: "Updated about page settings in Sanity" };
      } else {
        await saveLocalAboutSettings(aboutData);
        return { success: true, message: "Updated about settings locally" };
      }
    } catch (error) {
      console.error("Error saving about settings:", error);
      throw new Error("Failed to save about settings.");
    }
  });

// 12. ADMIN: Save/Update Service
export const saveService = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      token: z.string(),
      id: z.string().optional(),
      title: z.string().min(1),
      tagline: z.string().min(1),
      icon: z.string().min(1),
      bullets: z.array(z.string()),
      useCase: z.string().min(1),
      order: z.number(),
    })
  )
  .handler(async ({ data }) => {
    authorize(data.token);
    const { token, id, ...serviceData } = data;

    try {
      if (sanityWriteClient) {
        if (id) {
          await sanityWriteClient.patch(id).set(serviceData).commit();
          return { success: true, message: "Updated service in Sanity" };
        } else {
          await sanityWriteClient.create({
            _type: "service",
            ...serviceData,
          });
          return { success: true, message: "Created service in Sanity" };
        }
      } else {
        const saved = await saveLocalService({ id, ...serviceData });
        return { success: true, data: saved, message: "Saved service locally" };
      }
    } catch (error) {
      console.error("Error saving service:", error);
      throw new Error("Failed to save service.");
    }
  });

// 13. ADMIN: Delete Service
export const deleteService = createServerFn({ method: "POST" })
  .inputValidator(z.object({ token: z.string(), id: z.string() }))
  .handler(async ({ data }) => {
    authorize(data.token);

    try {
      if (sanityWriteClient) {
        await sanityWriteClient.delete(data.id);
        return { success: true, message: "Deleted service from Sanity" };
      } else {
        const deleted = await deleteLocalService(data.id);
        return { success: deleted, message: "Deleted service locally" };
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      throw new Error("Failed to delete service.");
    }
  });

// 14. PUBLIC: Get Blog Posts
export const getPublicBlogPosts = createServerFn({ method: "GET" })
  .handler(async () => {
    if (sanityReadClient) {
      try {
        const query = `*[_type == "post"] | order(date desc) {
          _id,
          title,
          excerpt,
          category,
          date,
          read,
          featured,
          mainImage,
          content
        }`;
        const posts = await sanityReadClient.fetch(query);
        return posts.length > 0 ? posts : DEFAULT_POSTS;
      } catch (error) {
        console.error("Error fetching blog posts from Sanity:", error);
        return DEFAULT_POSTS;
      }
    } else {
      const localData = await readLocalSubmissions();
      return localData.posts || DEFAULT_POSTS;
    }
  });

// 15. PUBLIC: Get Site Settings
export const getPublicSiteSettings = createServerFn({ method: "GET" })
  .handler(async () => {
    if (sanityReadClient) {
      try {
        const query = `*[_type == "siteSettings"][0] {
          heroTitleLine1,
          heroTitleLine2,
          heroDescription,
          heroImageLeft,
          heroImageCenter,
          heroImageRight,
          showcaseBanner
        }`;
        const settings = await sanityReadClient.fetch(query);
        return settings ? { ...DEFAULT_SETTINGS, ...settings } : DEFAULT_SETTINGS;
      } catch (error) {
        console.error("Error fetching site settings from Sanity:", error);
        return DEFAULT_SETTINGS;
      }
    } else {
      const localData = await readLocalSubmissions();
      return localData.settings || DEFAULT_SETTINGS;
    }
  });

// 16. PUBLIC: Get About Settings
export const getPublicAboutSettings = createServerFn({ method: "GET" })
  .handler(async () => {
    if (sanityReadClient) {
      try {
        const query = `*[_type == "aboutPage"][0] {
          eyebrow,
          titleLine1,
          titleLine2,
          description,
          missionTitle,
          missionBody,
          visionTitle,
          visionBody,
          problemEyebrow,
          problemTitleLine1,
          problemTitleLine2,
          problemItems,
          whyEyebrow,
          whyTitleLine1,
          whyTitleLine2,
          whyDescription,
          aboutImage
        }`;
        const aboutSettings = await sanityReadClient.fetch(query);
        return aboutSettings ? { ...DEFAULT_ABOUT_SETTINGS, ...aboutSettings } : DEFAULT_ABOUT_SETTINGS;
      } catch (error) {
        console.error("Error fetching about page settings from Sanity:", error);
        return DEFAULT_ABOUT_SETTINGS;
      }
    } else {
      const localData = await readLocalSubmissions();
      return localData.aboutSettings || DEFAULT_ABOUT_SETTINGS;
    }
  });

// 17. PUBLIC: Get Services List
export const getPublicServicesList = createServerFn({ method: "GET" })
  .handler(async () => {
    if (sanityReadClient) {
      try {
        const query = `*[_type == "service"] | order(order asc) {
          _id,
          title,
          tagline,
          icon,
          bullets,
          useCase,
          image,
          order
        }`;
        const services = await sanityReadClient.fetch(query);
        return services.length > 0 ? services : DEFAULT_SERVICES;
      } catch (error) {
        console.error("Error fetching services list from Sanity:", error);
        return DEFAULT_SERVICES;
      }
    } else {
      const localData = await readLocalSubmissions();
      return localData.services || DEFAULT_SERVICES;
    }
  });

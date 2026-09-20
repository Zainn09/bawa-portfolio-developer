import { projectTypes } from "@/data/portfolio";
export type ContactData = {
  name: string;
  email: string;
  company: string;
  storeUrl: string;
  platform: string;
  projectType: string;
  budget: string;
  message: string;
  website: string;
  startedAt: number;
};
export function validateContact(input: unknown): {
  data?: ContactData;
  errors: Record<string, string>;
} {
  if (!input || typeof input !== "object" || Array.isArray(input))
    return { errors: { form: "Please provide valid project details." } };
  const values = input as Record<string, unknown>;
  const text = (key: string) =>
    typeof values[key] === "string"
      ? (values[key] as string)
          .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
          .trim()
      : "";
  const data: ContactData = {
    name: text("name"),
    email: text("email"),
    company: text("company"),
    storeUrl: text("storeUrl"),
    platform: text("platform"),
    projectType: text("projectType"),
    budget: text("budget"),
    message: text("message"),
    website: text("website"),
    startedAt: typeof values.startedAt === "number" ? values.startedAt : 0,
  };
  const errors: Record<string, string> = {};
  if (data.name.length < 2 || data.name.length > 100)
    errors.name = "Please enter a name between 2 and 100 characters.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || data.email.length > 254)
    errors.email = "Please enter a valid email address.";
  if (!projectTypes.includes(data.projectType))
    errors.projectType = "Please choose a project type.";
  if (data.message.length < 20 || data.message.length > 5000)
    errors.message = "Tell me a little more: between 20 and 5,000 characters.";
  if (data.company.length > 150)
    errors.company = "Please use 150 characters or fewer.";
  if (data.platform.length > 100 || data.budget.length > 100)
    errors.form = "Please check the selected options.";
  if (data.storeUrl) {
    try {
      const u = new URL(data.storeUrl);
      if (
        !["http:", "https:"].includes(u.protocol) ||
        data.storeUrl.length > 500
      )
        throw Error();
    } catch {
      errors.storeUrl =
        "Use a full store URL, for example https://yourstore.com.";
    }
  }
  return Object.keys(errors).length ? { errors } : { data, errors };
}

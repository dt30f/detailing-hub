"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClaimRequest, createInquiry } from "@/lib/mutations";

function formDataToObject(formData: FormData) {
  return Object.fromEntries(formData.entries());
}

export async function submitInquiryAction(formData: FormData) {
  const studioSlug = String(formData.get("studioSlug") ?? "");

  await createInquiry(formDataToObject(formData));

  if (studioSlug) {
    revalidatePath(`/studiji/${studioSlug}`);
    redirect(`/studiji/${studioSlug}?sent=1`);
  }

  redirect("/studiji?sent=1");
}

export async function submitClaimRequestAction(formData: FormData) {
  const studioSlug = String(formData.get("studioSlug") ?? "");

  await createClaimRequest(formDataToObject(formData));

  if (studioSlug) {
    revalidatePath(`/studiji/${studioSlug}`);
    redirect(`/studiji/${studioSlug}?claim=1`);
  }

  redirect("/studiji?claim=1");
}

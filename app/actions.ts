"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createClaimRequest,
  createInquiry,
  createSubmittedStudio,
} from "@/lib/mutations";
import { createOwnerSession } from "@/lib/auth";

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

export async function submitStudioAction(formData: FormData) {
  const result = await createSubmittedStudio({
    ...formDataToObject(formData),
    serviceIds: formData.getAll("serviceIds").map(String),
  });

  if (result.status === "created" && result.ownerEmail) {
    await createOwnerSession(result.ownerEmail);
    revalidatePath("/admin/studios");
    redirect("/studio?submitted=1");
  }

  redirect(`/dodaj-studio?error=${result.status}`);
}

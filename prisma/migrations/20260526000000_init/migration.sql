-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'OWNER');

-- CreateEnum
CREATE TYPE "StudioStatus" AS ENUM ('UNCLAIMED', 'CLAIMED', 'VERIFIED', 'HIDDEN');

-- CreateEnum
CREATE TYPE "StudioType" AS ENUM ('STUDIO', 'MOBILE', 'BOTH');

-- CreateEnum
CREATE TYPE "ImageType" AS ENUM ('GENERAL', 'BEFORE_AFTER', 'WORKSHOP', 'EXTERIOR', 'PLACEHOLDER');

-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('NEW', 'CONTACTED', 'CLOSED', 'SPAM');

-- CreateEnum
CREATE TYPE "ClaimStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "City" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetailingStudio" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "shortDescription" TEXT,
    "description" TEXT,
    "cityId" TEXT NOT NULL,
    "address" TEXT,
    "municipality" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "instagram" TEXT,
    "whatsapp" TEXT,
    "workingHours" JSONB,
    "type" "StudioType" NOT NULL DEFAULT 'STUDIO',
    "status" "StudioStatus" NOT NULL DEFAULT 'UNCLAIMED',
    "sourceNote" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "ownerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DetailingStudio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudioService" (
    "id" TEXT NOT NULL,
    "studioId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "priceFrom" INTEGER,
    "priceTo" INTEGER,
    "durationMin" INTEGER,
    "description" TEXT,

    CONSTRAINT "StudioService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudioImage" (
    "id" TEXT NOT NULL,
    "studioId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "type" "ImageType" NOT NULL DEFAULT 'GENERAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudioImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudioView" (
    "id" TEXT NOT NULL,
    "studioId" TEXT NOT NULL,
    "viewerHash" TEXT,
    "referrer" TEXT,
    "userAgent" TEXT,
    "pathname" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudioView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inquiry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "message" TEXT NOT NULL,
    "studioId" TEXT NOT NULL,
    "serviceId" TEXT,
    "status" "InquiryStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Inquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClaimRequest" (
    "id" TEXT NOT NULL,
    "studioId" TEXT NOT NULL,
    "ownerName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "message" TEXT,
    "status" "ClaimStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClaimRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "studioId" TEXT NOT NULL,
    "serviceId" TEXT,
    "rating" INTEGER NOT NULL,
    "authorName" TEXT NOT NULL,
    "comment" TEXT,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PricingPlan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "priceMonthly" INTEGER NOT NULL,
    "features" JSONB,

    CONSTRAINT "PricingPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "studioId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "City_slug_key" ON "City"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "DetailingStudio_slug_key" ON "DetailingStudio"("slug");

-- CreateIndex
CREATE INDEX "DetailingStudio_cityId_idx" ON "DetailingStudio"("cityId");

-- CreateIndex
CREATE INDEX "DetailingStudio_status_idx" ON "DetailingStudio"("status");

-- CreateIndex
CREATE INDEX "DetailingStudio_isFeatured_idx" ON "DetailingStudio"("isFeatured");

-- CreateIndex
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");

-- CreateIndex
CREATE INDEX "StudioService_serviceId_idx" ON "StudioService"("serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "StudioService_studioId_serviceId_key" ON "StudioService"("studioId", "serviceId");

-- CreateIndex
CREATE INDEX "StudioView_studioId_createdAt_idx" ON "StudioView"("studioId", "createdAt");

-- CreateIndex
CREATE INDEX "StudioView_createdAt_idx" ON "StudioView"("createdAt");

-- CreateIndex
CREATE INDEX "StudioView_viewerHash_idx" ON "StudioView"("viewerHash");

-- CreateIndex
CREATE INDEX "Inquiry_studioId_idx" ON "Inquiry"("studioId");

-- CreateIndex
CREATE INDEX "Inquiry_status_idx" ON "Inquiry"("status");

-- CreateIndex
CREATE INDEX "ClaimRequest_studioId_idx" ON "ClaimRequest"("studioId");

-- CreateIndex
CREATE INDEX "ClaimRequest_status_idx" ON "ClaimRequest"("status");

-- CreateIndex
CREATE INDEX "Review_studioId_idx" ON "Review"("studioId");

-- CreateIndex
CREATE INDEX "Review_isApproved_idx" ON "Review"("isApproved");

-- CreateIndex
CREATE UNIQUE INDEX "PricingPlan_slug_key" ON "PricingPlan"("slug");

-- CreateIndex
CREATE INDEX "Subscription_studioId_idx" ON "Subscription"("studioId");

-- CreateIndex
CREATE INDEX "Subscription_planId_idx" ON "Subscription"("planId");

-- AddForeignKey
ALTER TABLE "DetailingStudio" ADD CONSTRAINT "DetailingStudio_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailingStudio" ADD CONSTRAINT "DetailingStudio_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudioService" ADD CONSTRAINT "StudioService_studioId_fkey" FOREIGN KEY ("studioId") REFERENCES "DetailingStudio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudioService" ADD CONSTRAINT "StudioService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudioImage" ADD CONSTRAINT "StudioImage_studioId_fkey" FOREIGN KEY ("studioId") REFERENCES "DetailingStudio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudioView" ADD CONSTRAINT "StudioView_studioId_fkey" FOREIGN KEY ("studioId") REFERENCES "DetailingStudio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inquiry" ADD CONSTRAINT "Inquiry_studioId_fkey" FOREIGN KEY ("studioId") REFERENCES "DetailingStudio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inquiry" ADD CONSTRAINT "Inquiry_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClaimRequest" ADD CONSTRAINT "ClaimRequest_studioId_fkey" FOREIGN KEY ("studioId") REFERENCES "DetailingStudio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_studioId_fkey" FOREIGN KEY ("studioId") REFERENCES "DetailingStudio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_studioId_fkey" FOREIGN KEY ("studioId") REFERENCES "DetailingStudio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "PricingPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

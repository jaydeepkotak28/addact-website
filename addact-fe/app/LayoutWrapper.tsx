// 👇 define client wrapper first
"use client";
import { usePathname } from "next/navigation";
import React from "react";
import Header from "@/components/templates/header";
import Footer from "@/components/templates/Footer";
import type { AddactHeaderData } from "@/graphql/queries/addact-header";
import type { CONTACTUS } from "@/graphql/queries/getHomePage";
import ContactUs from "@/components/organisms/ContactUs";
import { CONTACT_DRAWER_EVENT } from "@/lib/contactDrawer";

// 🔹 infer Footer prop type directly from Footer component
type FooterProps = React.ComponentProps<typeof Footer>;

function LayoutWrapper({
  children,
  headerData,
  footerData,
  contactSidebarData,
}: {
  children: React.ReactNode;
  headerData: AddactHeaderData;
  footerData?: FooterProps["data"];
  contactSidebarData?: CONTACTUS;
}) {
  const pathname = usePathname();
  const [isContactSidebarOpen, setContactSidebarOpen] = React.useState(false);
  const hideHeaderFooter = pathname === "/hire-certified-sitecore-developer";

  const isAIPage = pathname === "/ai-services";
  const isUIUXPage = pathname === "/ui-ux-service";
  const isHomePage = pathname === "/";

  const isTransparentHeaderPage = isAIPage || isUIUXPage || isHomePage;

  React.useEffect(() => {
    setContactSidebarOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    const handleOpenContactDrawer = () => {
      setContactSidebarOpen(true);
    };

    window.addEventListener(CONTACT_DRAWER_EVENT, handleOpenContactDrawer as EventListener);

    return () => {
      window.removeEventListener(CONTACT_DRAWER_EVENT, handleOpenContactDrawer as EventListener);
    };
  }, []);

  return (
    <>
      {!hideHeaderFooter && (
        <Header
          headerData={headerData}
          // onContactClick={() => setContactSidebarOpen(true)}
          transparentHeader={isTransparentHeaderPage}
        />
      )}
      {children}
      {!hideHeaderFooter && footerData && <Footer data={footerData} />}
      {!hideHeaderFooter && contactSidebarData && (
        <ContactUs
          data={contactSidebarData}
          addressInformation={footerData?.AddressInformation}
          isDrawer
          isOpen={isContactSidebarOpen}
          onClose={() => setContactSidebarOpen(false)}
        />
      )}
    </>
  );
}

export default LayoutWrapper;

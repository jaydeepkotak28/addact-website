import React, { FC, Fragment } from "react";
import { CaretRightIcon } from "./icons";
import Link from "next/link";

export type Crumb = {
  label: string;
  href?: string;
  isCurrent?: boolean;
};

type Props = {
  crumbs: Crumb[];
  className?: string;
};

const Breadcrumps: FC<Props> = ({ crumbs, className }) => {
  if (!crumbs || crumbs.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={`${className ?? ""} lg:mt-16  sm:mx-0 sm:px-0 overflow-x-auto no-scrollbar`}
    >
      <ol className="flex items-center gap-2 sm:gap-3 text-sm text-white !list-none !pl-0 whitespace-nowrap !mt-0 !mb-0">
        {crumbs.map((crumb, idx) => {
          const isLast = idx === crumbs.length - 1;
          return (
            <Fragment key={idx}>
              <li className="!mb-0">
                {crumb.href && !isLast ? (
                  <Link
                    href={crumb.href}
                    className="text-white hover:underline !text-[14px]  !no-underline"
                  >
                    {crumb.label}
                  </Link>
                ) : isLast && crumb.href ? (
                  crumb.isCurrent ? (
                    <span
                      aria-current="page"
                      className="!text-white font-medium truncate max-w-[60vw] sm:max-w-[40ch] !text-[14px] sm:!text-[16px] md:!text-[20px]"
                    >
                      {crumb.label}
                    </span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="text-white hover:underline !text-[14px] sm:!text-[16px] md:!text-[20px] !no-underline"
                    >
                      {crumb.label}
                    </Link>
                  )
                ) : (
                  <span
                    aria-current={crumb.isCurrent ? "page" : undefined}
                    className={`!text-white ${crumb.isCurrent ? "font-medium" : ""} truncate ${
                      isLast ? "max-w-[60vw] sm:max-w-[40ch] !text-[14px]" : "!text-[14px]"
                    }`}
                  >
                    {crumb.label}
                  </span>
                )}
              </li>

              {idx < crumbs.length - 1 && (
                <li className="!text-white !mb-0 !text-[14px] ">
                  <CaretRightIcon aria-hidden="true" />
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumps;

"use client";

import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import "./blog.css";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function BlogClient({ blogs, locale }) {
    const t = useTranslations("BlogPage");

    // Sayfalama için durumlar
    const [currentPage, setCurrentPage] = useState(1);
    const blogsPerPage = 5;

    // Blogları sayfalara bölme
    const indexOfLastBlog = currentPage * blogsPerPage;
    const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
    const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

    // Toplam sayfa sayısını hesaplama
    const totalPages = Math.ceil(blogs.length / blogsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toISOString().split("T")[0];
        } catch (error) {
            console.warn("Invalid date format:", dateString);
            return "";
        }
    };

    const sanitizeContent = (content) => {
        return content ? content.trim().substring(0, 50) + "..." : "";
    };

    return (
        <div>
            <div className="blogPageHeaderDiv">
                <h1>{t("header")}</h1>
                <FaChevronDown />
            </div>
            <div className="blogPageMain">
                <div className="blogMain">
                    {currentBlogs.map((blog) => (
                        <div key={blog.id}>
                            <Link
                                className="blogCard"
                                style={{ color: "black", width: "800px" }}
                                href={`/${locale}/blog/${blog.id}`}
                            >
                                <img src={blog.image} alt={`E-VetDose_${blog.title[locale] || "default"}`} />
                                <div className="blogCardContent">
                                    <h3>{blog.title[locale]}</h3>
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: sanitizeContent(blog.content?.[locale]),
                                        }}
                                    />
                                    <div>
                                        <span>{formatDate(blog.dateAdded)}</span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>

                <div className="blogSidebar">
                    <div className="blogSidebarSection">
                        <h3>{t("recentPosts")}</h3>
                        {blogs.slice(0, 2).map((blog) => (
                            <Link
                                key={blog.id}
                                style={{ color: "black", width: "100%" }}
                                href={`/${locale}/blog/${blog.id}`}
                            >
                                <div className="blogSidebarCard">
                                    <img src={blog.image} alt={`E-VetDose_${blog.title[locale] || "default"}`} />
                                    <div>
                                        <h4>{blog.title[locale]}</h4>
                                        <span>{formatDate(blog.dateAdded)}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div className="blogSidebarBanner">
                        <img
                            src="https://picsum.photos/300/300"
                            alt={`E-VetDose_${t("bannerAlt")}`}
                        />
                    </div>
                </div>
            </div>

            {/* Sayfalama Butonları */}
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        className={`page-button ${currentPage === index + 1 ? "active" : ""}`}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}
"use client";

import React, { useEffect } from "react";
import { FaHeart, FaTwitter, FaFacebook, FaEnvelope, FaLink, FaChevronDown, FaChevronRight, FaChevronLeft } from "react-icons/fa";
import Link from "next/link";
import { useLikes } from "../../../../useLikes";
import { useTranslations } from "next-intl";
import "./blogDetail.css";

function BlogDetailClient({ blog, blogs, locale }) {
    const t = useTranslations("BlogDetailPage");
    const { likesCount, isLiked, handleToggleLike } = useLikes("blogs", blog.id);
    const currentUrl = typeof window !== "undefined" ? window.location.href : "";

    // Mevcut blogun indeksini bul
    const currentIndex = blogs.findIndex((b) => b.id === blog.id);

    // Bir önceki ve bir sonraki blogu hesapla
    const previousBlog = currentIndex > 0 ? blogs[currentIndex - 1] : null;
    const nextBlog = currentIndex < blogs.length - 1 ? blogs[currentIndex + 1] : null;
    useEffect(() => {
        if (!localStorage.getItem("deviceId")) {
            const newDeviceId = `device-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
            localStorage.setItem("deviceId", newDeviceId);
        }
    }, []);


    const handleShare = (platform) => {
        switch (platform) {
            case "twitter":
                window.open(`https://twitter.com/intent/tweet?text=Check+this+out!&url=${currentUrl}`, "_blank");
                break;
            case "facebook":
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`, "_blank");
                break;
            case "email":
                window.location.href = `mailto:?subject=Check this out&body=${currentUrl}`;
                break;
            case "link":
                navigator.clipboard.writeText(currentUrl);
                alert("Link copied to clipboard!");
                break;
            default:
                break;
        }
    };

    return (
        <div className="blogDetailPage">
            {/* Blog Detayları */}
            <div className="blogDetailImageHeader">
                <img className="blogDetailsBanner" src={blog.image} alt={blog.title[locale]} />
                <div className="blogDetailHeaderDiv">
                    <h1>{blog.title[locale]}</h1>
                    <ul>
                        <li>
                            <p>{new Date(blog.dateAdded).toISOString().split("T")[0]}</p>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="blogDetailContent">
                <div style={{ lineHeight: "1.6" }} dangerouslySetInnerHTML={{ __html: blog.content?.[locale] }} />
                <div className="social-container">
                    <div className="like-button" onClick={handleToggleLike}>
                        <FaHeart className={`heart-icon ${isLiked ? "liked" : ""}`} />
                        <span className="like-count">{likesCount || 0}</span>
                    </div>
                    <div className="share-buttons">
                        <button className="share-button twitter" onClick={() => handleShare("twitter")} aria-label="Share on Twitter">
                            <FaTwitter />
                        </button>
                        <button className="share-button facebook" onClick={() => handleShare("facebook")} aria-label="Share on Facebook">
                            <FaFacebook />
                        </button>
                        <button className="share-button email" onClick={() => handleShare("email")} aria-label="Share via Email">
                            <FaEnvelope />
                        </button>
                        <button className="share-button link" onClick={() => handleShare("link")} aria-label="Copy Link">
                            <FaLink />
                        </button>
                    </div>
                </div>
            </div>
            {/* Önceki ve Sonraki Blog */}
            <div className="previousNextBlogContainer">
                <div className="previousNextBlogContent">
                    {previousBlog && (
                        <div className="previousBlog">
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    textAlign: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <FaChevronLeft />
                                <h3>{t("previousPost")}</h3>
                            </div>
                            <Link
                                href={`/${locale}/blog/${previousBlog.id}`}
                                className="blogLink"
                            >
                                <img
                                    src={previousBlog.image}
                                    alt={`B&B_${previousBlog.title[locale]}`}
                                    className="blogImage"
                                />
                                <div>
                                    <h4 className="blogTitle">
                                        {previousBlog.title[locale]}
                                    </h4>
                                    <div
                                        className="blogExcerpt"
                                        dangerouslySetInnerHTML={{
                                            __html: previousBlog.content?.[locale]?.substring(
                                                0,
                                                50
                                            ) + "...",
                                        }}
                                    />
                                </div>
                            </Link>
                        </div>
                    )}
                    {nextBlog && (
                        <div className="nextBlog">
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    textAlign: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <h3>{t("nextPost")}</h3>
                                <FaChevronRight />
                            </div>
                            <Link
                                href={`/${locale}/blog/${nextBlog.id}`}
                                className="blogLink"
                            >
                                <img
                                    src={nextBlog.image}
                                    alt={`B&B_${nextBlog.title[locale]}`}
                                    className="blogImage"
                                />
                                <div>
                                    <h4 className="blogTitle">
                                        {nextBlog.title[locale]}
                                    </h4>
                                    <div
                                        className="blogExcerpt"
                                        dangerouslySetInnerHTML={{
                                            __html: nextBlog.content?.[locale]?.substring(
                                                0,
                                                50
                                            ) + "...",
                                        }}
                                    />
                                </div>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default BlogDetailClient;
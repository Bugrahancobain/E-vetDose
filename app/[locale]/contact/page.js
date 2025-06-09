"use client";

import React, { useRef } from "react";
import emailjs from "emailjs-com";
import { FaUser, FaEnvelope, FaPhone, FaInfoCircle, FaPencilAlt } from "react-icons/fa";
import { MdPhoneIphone } from "react-icons/md";
import { IoIosMail } from "react-icons/io";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useTranslations } from "next-intl";
import "./contact.css"

export default function ContactFormEmailJS() {
    const t = useTranslations("ContactPage");
    const form = useRef();

    const sendEmail = (e) => {
        e.preventDefault();
        emailjs
            .sendForm(
                process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
                process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
                form.current,
                process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
            )
            .then(
                (result) => {
                    alert("Mesaj başarıyla gönderildi!");
                    console.log(result.text);
                },
                (error) => {
                    alert("Mesaj gönderilirken hata oluştu!");
                    console.log(error.text);
                }
            );
        e.target.reset();
    };

    return (
        <div>
            <div className="contactBanner">
                <img src="/contact-banner.webp" alt="contact-banner.webp" />
            </div>
            <div className="contactFormDiv">

                <div className="contactFormText">
                    <h3>{t("contactUsTitle")}</h3>
                    <h2>{t("contactUsSubtitle")}</h2>
                    <h4>{t("contactUsDescription")}</h4>
                    <div className="contactMarkt">
                        <FaMapMarkerAlt className="contactSvg" />
                        <p>{t("contactInfoAddress")}</p>
                    </div>
                    <div className="contactMarkt">
                        <MdPhoneIphone className="contactSvg" />
                        <p>{t("contactInfoPhone")}</p>
                    </div>
                    <div className="contactMarkt">
                        <IoIosMail className="contactSvg" />
                        <p>{t("contactInfoEmail")}</p>
                    </div>
                </div>
                <div className="formClassTest">
                    <form ref={form} onSubmit={sendEmail} className="contactForm">
                        <div className="formGroup">
                            <FaUser className="formIcon" />
                            <input type="text" name="user_name" placeholder={t("formName")} required />
                        </div>
                        <div className="formGroup">
                            <FaEnvelope className="formIcon" />
                            <input type="email" name="user_email" placeholder={t("formEmail")} required />
                        </div>
                        <div className="formGroup">
                            <FaPhone className="formIcon" />
                            <input type="tel" name="user_phone" placeholder={t("formPhone")} required />
                        </div>
                        <div className="formGroup">
                            <FaInfoCircle className="formIcon" />
                            <input type="text" name="user_subject" placeholder={t("formSubject")} required />
                        </div>
                        <div className="formGroup">
                            <FaPencilAlt className="formIcon" />
                            <textarea name="message" placeholder={t("formMessage")} required></textarea>
                        </div>
                        <button type="submit" className="submitButton">
                            {t("formSubmit")}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
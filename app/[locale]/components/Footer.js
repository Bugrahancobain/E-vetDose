'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import React, { useState } from 'react';
import "../styles/footer.css";
import { FaFacebookSquare, FaTwitterSquare, FaLinkedin, FaInstagram } from "react-icons/fa";

function Footer({ locale }) {
    const t = useTranslations('footer');
    const year = new Date().getFullYear();
    const [modalType, setModalType] = useState(null);

    const closeModal = () => setModalType(null);

    return (
        <div className='footerMain'>
            <Link href={`/${locale}/`}>
                <img className='footerLogo' src="/Logo.png" alt="E-vetDoseLogo.png" />
            </Link>

            <div className='footerInfo'>
                <div className='footerContactDiv'>
                    <h3>{t('followUs')}</h3>
                    <div>
                        <Link href="#" target='_blank'><FaFacebookSquare /></Link>
                        <Link href="#" target='_blank'><FaTwitterSquare /></Link>
                        <Link href="#" target='_blank'><FaLinkedin /></Link>
                        <Link href="#" target='_blank'><FaInstagram /></Link>
                    </div>
                </div>

                <div className='footerResourcesDiv'>
                    <h3>{t('resources')}</h3>
                    <div>
                        <Link href={`/${locale}/`}>{t('home')}</Link>
                        <Link href={`/${locale}/aboutUs`}>{t('about')}</Link>
                        <Link href={`/${locale}/pricing`}>{t('pricing')}</Link>
                        <Link href={`/${locale}/blog`}>{t('blog')}</Link>
                        <Link href={`/${locale}/contact`}>{t('contact')}</Link>
                    </div>
                </div>
            </div>

            <div className='footerBottom'>
                <div>© {year} E-VetDose App. {t('allRights')}</div>
                <div className='FooterPolicyDiv'>
                    <button onClick={() => setModalType('privacy')}>{t('privacyPolicy')}</button>
                    <button onClick={() => setModalType('terms')}>{t('termsOfService')}</button>
                </div>
            </div>

            {modalType && (
                <div className="policyModalOverlay">
                    <div className="policyModal">
                        <h2>
                            {modalType === 'privacy' ? 'Gizlilik Politikası' : 'Kullanım Şartları'}
                        </h2>
                        <div className="policyModalContent">
                            {modalType === 'privacy' ? (
                                <>
                                    <p><strong>Veri Güvenliği:</strong> E-VetDose olarak kullanıcı verilerinizin gizliliğine büyük önem veriyoruz. Kayıtlı hiçbir bilgi üçüncü taraflarla paylaşılmaz.</p>
                                    <p><strong>Çerezler:</strong> Web sitemizde kullanıcı deneyimini geliştirmek amacıyla çerezler kullanılmaktadır. Bu çerezleri dilediğiniz zaman tarayıcı ayarlarından devre dışı bırakabilirsiniz.</p>
                                    <p><strong>Veri Paylaşımı:</strong> Sadece yasal yükümlülükler çerçevesinde resmi mercilere bilgi sağlanır. Üçüncü parti reklam hizmetleri veya analiz araçları kullanmamaktayız.</p>
                                    <p><strong>İletişim:</strong> Gizlilik politikamızla ilgili sorularınız için bizimle iletişime geçebilirsiniz: info@e-vetdose.com</p>
                                </>
                            ) : (
                                <>
                                    <p><strong>Kullanım Koşulları:</strong> E-VetDose platformu yalnızca veteriner hekimler tarafından kullanılmak üzere geliştirilmiştir. Bilgi içerikleri bilgilendirme amaçlıdır ve teşhis yerine geçmez.</p>
                                    <p><strong>Sorumluluk Reddi:</strong> Kullanıcıların uygulamayı kullanırken yaptıkları tıbbi işlemlerde tüm sorumluluk kullanıcıya aittir. E-VetDose herhangi bir doğrudan ya da dolaylı zarardan sorumlu tutulamaz.</p>
                                    <p><strong>Hizmetin Sürekliliği:</strong> Hizmetin kesintisiz sürdürülmesi için azami çaba gösterilir. Ancak teknik aksaklıklarda uygulamanın geçici olarak durdurulabileceği unutulmamalıdır.</p>
                                    <p><strong>Lisanslar ve Güncellemeler:</strong> Yazılımın tüm hakları saklıdır. Kullanım şartları zaman zaman güncellenebilir, bu nedenle kullanıcılarımızın düzenli olarak kontrol etmeleri önerilir.</p>
                                </>
                            )}
                        </div>
                        <button onClick={closeModal} className="closeModalButton">Kapat</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Footer;
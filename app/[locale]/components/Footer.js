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
            <div style={{ width: "100%", textAlign: "center", borderBottom: "1px solid white", paddingBottom: "30px" }}>
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
                <img style={{ width: "50%", textAlign: "center" }} src="/iyzico_Logo.png" alt="/iyzico_Logo.png" />

            </div>

            <div className='footerBottom'>
                <div>© {year} E-VetDose App. {t('allRights')}</div>
                <div className='FooterPolicyDiv'>
                    <button onClick={() => setModalType('privacy')}>{t('privacyPolicy')}</button>
                    <button onClick={() => setModalType('terms')}>{t('termsOfService')}</button>
                    <button onClick={() => setModalType('delivery')}>Teslimat ve İade Şartları</button>
                    <button onClick={() => setModalType('distanceSales')}>Mesafeli Satış Sözleşmesi</button>
                </div>
            </div>

            {
                modalType && (
                    <div className="policyModalOverlay">
                        <div className="policyModal">
                            <h2>
                                {modalType === 'privacy'
                                    ? 'Gizlilik Politikası'
                                    : modalType === 'terms'
                                        ? 'Kullanım Şartları'
                                        : modalType === 'delivery'
                                            ? 'Teslimat ve İade Şartları'
                                            : 'Mesafeli Satış Sözleşmesi'}
                            </h2>

                            <div className="policyModalContent">
                                {modalType === 'privacy' ? (
                                    <>
                                        <p><strong>Veri Güvenliği:</strong> E-VetDose olarak kullanıcı verilerinizin güvenliğini öncelikli tutarız. Tüm kişisel bilgiler, güvenli sunucularda şifrelenerek saklanır ve hiçbir şekilde üçüncü şahıslarla paylaşılmaz.</p>
                                        <p><strong>Çerez Kullanımı:</strong> Kullanıcı deneyimini geliştirmek için çerezler (cookies) kullanılmaktadır. Çerezleri tarayıcı ayarlarınızdan istediğiniz zaman devre dışı bırakabilirsiniz.</p>
                                        <p><strong>Üçüncü Taraf Erişimi:</strong> E-VetDose, reklam hizmeti veya üçüncü taraf analiz aracı kullanmaz. Gerekli görüldüğünde yalnızca yasal mercilere bilgi aktarımı yapılabilir.</p>
                                        <p><strong>Veri Toplama:</strong> Sisteme giriş sırasında yalnızca hizmetin sunulması için gerekli temel bilgiler (e-posta, isim, kullanıcı etkinliği) toplanır.</p>
                                        <p><strong>İletişim:</strong> Gizlilik politikamız hakkında detaylı bilgi almak için bize info@e-vetdose.com adresinden ulaşabilirsiniz.</p>
                                    </>
                                ) : modalType === 'terms' ? (
                                    <>
                                        <p><strong>Hizmet Tanımı:</strong> E-VetDose, veteriner hekimlere yönelik dijital doz hesaplama, ilaç rehberi, AI destekli asistan ve alarm sistemleri sunar. Bu hizmet yalnızca kayıtlı kullanıcılar tarafından kullanılabilir.</p>
                                        <p><strong>Hekim Sorumluluğu:</strong> Uygulama yalnızca destek ve referans amacı taşır. Kullanıcılar, sunduğumuz bilgilere dayanarak yaptıkları tıbbi işlemlerin sorumluluğunu tamamen kendileri üstlenir.</p>
                                        <p><strong>Üyelik ve Hesap Kullanımı:</strong> Her kullanıcı yalnızca kendi hesabını kullanabilir. Başkasına ait bilgileri kullanmak veya paylaşmak yasaktır.</p>
                                        <p><strong>Hizmetin Kesintiye Uğraması:</strong> Teknik bakım, güncelleme ya da zorunlu durumlarda geçici erişim sorunları yaşanabilir. E-VetDose bu süre zarfında oluşabilecek aksaklıklardan sorumlu tutulamaz.</p>
                                        <p><strong>İçerik Hakları:</strong> Uygulama içeriği, yazılımlar ve grafikler dahil olmak üzere tüm materyallerin hakları E-VetDose’a aittir. İzinsiz kopyalama, çoğaltma veya dağıtım yasaktır.</p>
                                        <p><strong>Değişiklik Hakkı:</strong> Kullanım şartları, gerektiğinde haber vermeksizin güncellenebilir. Kullanıcıların periyodik olarak bu sayfayı kontrol etmeleri önerilir.</p>
                                    </>
                                ) : modalType === 'delivery' ? (
                                    <>
                                        <p><strong>Teslimat:</strong> E-VetDose dijital bir platformdur ve ürünlerimiz fiziksel gönderim içermez. Hizmet, ödeme işleminin ardından anlık olarak dijital ortamda sağlanır.</p>
                                        <p><strong>İade Şartları:</strong> 6502 sayılı Tüketicinin Korunması Hakkında Kanun’un 15. maddesi uyarınca, anında ifa edilen ve elektronik ortamda sunulan hizmetlerde cayma hakkı bulunmamaktadır. Bu nedenle satın alma sonrasında iade yapılmamaktadır.</p>
                                        <p><strong>Destek:</strong> Teslimat ve iade konularıyla ilgili destek almak için info@e-vetdose.com adresinden bizimle iletişime geçebilirsiniz.</p>
                                    </>
                                ) : (
                                    <>
                                        <p><strong>Sözleşmenin Konusu:</strong> Bu sözleşme, E-VetDose’un sunduğu dijital hizmetlerin online olarak satışı ve kullanıcıya sunulması esaslarına dayanır.</p>
                                        <p><strong>Hizmetin Tanımı:</strong> E-VetDose, veteriner hekimlere yönelik dijital rehber, doz hesaplama, ilaç arama ve AI destekli asistan hizmetleri sunar.</p>
                                        <p><strong>Satın Alma ve Ödeme:</strong> Kullanıcı, hizmeti satın alarak bu sözleşmenin tüm şartlarını kabul etmiş sayılır. Ödemeler güvenli ödeme altyapısı (iyzico) üzerinden yapılır.</p>
                                        <p><strong>Cayma Hakkı:</strong> Dijital hizmetlerde, kullanım başlamışsa cayma hakkı bulunmamaktadır.</p>
                                        <p><strong>Yetki ve Uyuşmazlık:</strong> Taraflar arasında çıkabilecek uyuşmazlıklarda İstanbul Bakırköy Mahkemeleri yetkilidir.</p>
                                        <p><strong>İletişim:</strong> info@e-vetdose.com</p>
                                    </>
                                )}
                            </div>

                            <button onClick={closeModal} className="closeModalButton">Kapat</button>
                        </div>
                    </div>
                )
            }
        </div >
    );
}

export default Footer;
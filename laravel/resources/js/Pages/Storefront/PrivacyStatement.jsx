import { Head } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';

export default function PrivacyStatement() {
    return (
        <>
            <Head title="Privacy Statement – GadgetShack" />
            <StorefrontLayout>
                <section className="mx-auto max-w-4xl px-4 py-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Statement</h1>
                    <p className="text-sm text-gray-500 mb-8">Last updated: March 2026</p>

                    {/* Introduction */}
                    <div className="mb-8">
                        <p className="text-gray-700 mb-4">
                            GadgetShack ("we", "us", "our") is committed to protecting your personal information
                            and respecting your privacy. This Privacy Statement explains how we collect, use, store,
                            and share your personal information when you visit our website or purchase from us.
                        </p>
                        <p className="text-gray-700">
                            This statement is governed by the Protection of Personal Information Act (POPIA, No. 4 of 2013)
                            and the Electronic Communications and Transactions Act (ECTA, No. 25 of 2002) of the Republic
                            of South Africa.
                        </p>
                    </div>

                    {/* 1. Information We Collect */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Information We Collect</h2>
                        <p className="text-gray-700 mb-3">We collect the following personal information:</p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li><span className="font-medium">Identity information:</span> First name, last name, username or similar identifier.</li>
                            <li><span className="font-medium">Contact information:</span> Email address, telephone number, and delivery address.</li>
                            <li><span className="font-medium">Transaction information:</span> Details of orders placed, products purchased, and payment method used (we do not store full card details).</li>
                            <li><span className="font-medium">Technical information:</span> IP address, browser type and version, time zone, browser plug-in types, operating system, and platform.</li>
                            <li><span className="font-medium">Usage information:</span> Information about how you use our website, products, and services.</li>
                            <li><span className="font-medium">Marketing preferences:</span> Your preferences for receiving marketing communications from us.</li>
                        </ul>
                    </div>

                    {/* 2. How We Collect Information */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">2. How We Collect Your Information</h2>
                        <ul className="list-none space-y-2 text-gray-700">
                            <li><span className="font-medium">2.1 Direct interactions:</span> When you create an account, place an order, subscribe to our newsletter, or contact us.</li>
                            <li><span className="font-medium">2.2 Automated technologies:</span> As you interact with our website, we may automatically collect technical and usage data using cookies, server logs, and similar technologies.</li>
                            <li><span className="font-medium">2.3 Third parties:</span> We may receive data from payment processors, analytics providers, and delivery partners.</li>
                        </ul>
                    </div>

                    {/* 3. How We Use Your Information */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">3. How We Use Your Information</h2>
                        <p className="text-gray-700 mb-3">We use your personal information to:</p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li>Process and fulfil your orders, including arranging delivery.</li>
                            <li>Manage your account and provide customer support.</li>
                            <li>Send you order confirmations, invoices, and transactional communications.</li>
                            <li>Send marketing communications where you have consented or where we have a legitimate interest.</li>
                            <li>Improve our website, products, and services through analytics.</li>
                            <li>Comply with our legal obligations under South African law.</li>
                            <li>Prevent fraud and ensure the security of our systems.</li>
                        </ul>
                    </div>

                    {/* 4. Sharing Your Information */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Sharing Your Information</h2>
                        <p className="text-gray-700 mb-3">
                            We do not sell your personal information. We may share your data with:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li><span className="font-medium">Delivery partners</span> — to fulfil and track your orders.</li>
                            <li><span className="font-medium">Payment processors</span> — to securely process your payments.</li>
                            <li><span className="font-medium">IT and analytics providers</span> — to maintain and improve our website.</li>
                            <li><span className="font-medium">Legal and regulatory bodies</span> — where required by law or to protect our legal rights.</li>
                        </ul>
                        <p className="text-gray-700 mt-3">
                            All third parties are required to process your data securely and only for the specified purpose.
                        </p>
                    </div>

                    {/* 5. Cookies */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Cookies</h2>
                        <p className="text-gray-700 mb-3">
                            Our website uses cookies to distinguish you from other users and improve your browsing experience.
                            We use the following types of cookies:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li><span className="font-medium">Strictly necessary cookies:</span> Required for the website to function (e.g., maintaining your cart and session).</li>
                            <li><span className="font-medium">Analytical/performance cookies:</span> Help us understand how visitors interact with our website.</li>
                            <li><span className="font-medium">Functionality cookies:</span> Remember your preferences and settings.</li>
                            <li><span className="font-medium">Targeting cookies:</span> Used to deliver relevant advertisements and track marketing campaign performance.</li>
                        </ul>
                        <p className="text-gray-700 mt-3">
                            You can set your browser to refuse all or some cookies. However, blocking certain cookies may affect your ability to use our website.
                        </p>
                    </div>

                    {/* 6. Data Security */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Data Security</h2>
                        <p className="text-gray-700">
                            We implement appropriate technical and organisational security measures to protect your personal
                            information against unauthorised access, alteration, disclosure, or destruction. All payment
                            transactions are encrypted using SSL technology. However, no method of transmission over the
                            internet is 100% secure, and we cannot guarantee absolute security.
                        </p>
                    </div>

                    {/* 7. Data Retention */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Data Retention</h2>
                        <p className="text-gray-700">
                            We retain your personal information only for as long as necessary to fulfil the purposes for which
                            it was collected, including to satisfy legal, accounting, or reporting requirements. Order records
                            are typically retained for 5 years in accordance with South African tax and accounting legislation.
                        </p>
                    </div>

                    {/* 8. Your Rights */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Your Rights Under POPIA</h2>
                        <p className="text-gray-700 mb-3">You have the right to:</p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li>Request access to the personal information we hold about you.</li>
                            <li>Request correction of inaccurate or incomplete information.</li>
                            <li>Request deletion of your personal information (subject to legal obligations).</li>
                            <li>Object to the processing of your personal information.</li>
                            <li>Withdraw consent at any time where processing is based on consent.</li>
                            <li>Lodge a complaint with the Information Regulator of South Africa.</li>
                        </ul>
                        <p className="text-gray-700 mt-3">
                            To exercise any of these rights, please contact us at{' '}
                            <a href="mailto:info@gadgetshack.co.za" className="text-blue-600 hover:underline">
                                info@gadgetshack.co.za
                            </a>.
                        </p>
                    </div>

                    {/* 9. Third-Party Links */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Third-Party Links</h2>
                        <p className="text-gray-700">
                            Our website may include links to third-party websites, plug-ins, and applications. Clicking
                            those links may allow third parties to collect or share data about you. We do not control
                            third-party websites and are not responsible for their privacy statements.
                        </p>
                    </div>

                    {/* 10. Changes */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Changes to This Privacy Statement</h2>
                        <p className="text-gray-700">
                            We may update this Privacy Statement from time to time. Any changes will be posted on this page
                            with an updated revision date. We encourage you to review this page periodically.
                        </p>
                    </div>

                    {/* 11. Contact */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Contact Us</h2>
                        <p className="text-gray-700">
                            If you have any questions, concerns, or requests regarding this Privacy Statement or your
                            personal information, please contact our Privacy Officer at:{' '}
                            <a href="mailto:info@gadgetshack.co.za" className="text-blue-600 hover:underline">
                                info@gadgetshack.co.za
                            </a>.
                        </p>
                    </div>

                    <p className="text-gray-700 mt-10 pt-6 border-t border-gray-200 text-sm">
                        GadgetShack complies with the Protection of Personal Information Act (POPIA, No. 4 of 2013),
                        the Electronic Communications and Transactions Act (ECTA, No. 25 of 2002), and the Consumer
                        Protection Act (No. 68 of 2008).
                    </p>
                </section>
            </StorefrontLayout>
        </>
    );
}


import { Head } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';

export default function TermsConditions() {
    return (
        <>
            <Head title="Terms & Conditions – GadgetVilla" />
            <StorefrontLayout>
                <section className="mx-auto max-w-4xl px-4 py-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms &amp; Conditions</h1>
                    <p className="text-sm text-gray-500 mb-8">Last updated: March 2026</p>

                    {/* Introduction */}
                    <div className="mb-8">
                        <p className="text-gray-700 mb-4">
                            Welcome to GadgetVilla. By accessing or using our website and purchasing our products,
                            you agree to be bound by the following Terms &amp; Conditions. Please read them carefully
                            before placing an order. If you do not agree to these terms, please do not use our website.
                        </p>
                        <p className="text-gray-700">
                            GadgetVilla reserves the right to update or change these Terms &amp; Conditions at any time
                            without prior notice. Your continued use of the website following any changes constitutes
                            acceptance of those changes.
                        </p>
                    </div>

                    {/* 1. General */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">1. General</h2>
                        <ul className="list-none space-y-2 text-gray-700">
                            <li><span className="font-medium">1.1</span> GadgetVilla operates as an online retail store selling refurbished and new electronic devices within the Republic of South Africa.</li>
                            <li><span className="font-medium">1.2</span> All products listed on our website are subject to availability. We reserve the right to discontinue any product at any time.</li>
                            <li><span className="font-medium">1.3</span> By placing an order, you confirm that you are at least 18 years of age and legally capable of entering into a binding contract.</li>
                        </ul>
                    </div>

                    {/* 2. Orders & Pricing */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Orders &amp; Pricing</h2>
                        <ul className="list-none space-y-2 text-gray-700">
                            <li><span className="font-medium">2.1</span> All prices are displayed in South African Rand (ZAR) and include VAT, unless stated otherwise.</li>
                            <li><span className="font-medium">2.2</span> GadgetVilla reserves the right to correct any pricing errors on the website. If an order is placed at an incorrect price, we will contact you before processing the order.</li>
                            <li><span className="font-medium">2.3</span> An order confirmation email does not constitute acceptance of your order. Acceptance occurs when the order is dispatched.</li>
                            <li><span className="font-medium">2.4</span> We reserve the right to cancel or refuse any order at our discretion, including where payment cannot be verified.</li>
                        </ul>
                    </div>

                    {/* 3. Payment */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Payment</h2>
                        <ul className="list-none space-y-2 text-gray-700">
                            <li><span className="font-medium">3.1</span> Payment must be made in full at the time of purchase before the order is processed.</li>
                            <li><span className="font-medium">3.2</span> We accept major credit and debit cards, EFT, and other payment methods as displayed at checkout.</li>
                            <li><span className="font-medium">3.3</span> GadgetVilla uses secure, encrypted payment processing. We do not store card details on our servers.</li>
                        </ul>
                    </div>

                    {/* 4. Delivery */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Delivery</h2>
                        <ul className="list-none space-y-2 text-gray-700">
                            <li><span className="font-medium">4.1</span> We deliver within the Republic of South Africa only. Delivery times and fees are set out in our <a href="/shipping-policy" className="text-blue-600 hover:underline">Shipping Policy</a>.</li>
                            <li><span className="font-medium">4.2</span> Risk of loss or damage passes to you upon delivery and signature of the delivery document.</li>
                            <li><span className="font-medium">4.3</span> GadgetVilla is not liable for delays caused by circumstances beyond our reasonable control, including courier delays, load shedding, or public holidays.</li>
                        </ul>
                    </div>

                    {/* 5. Returns & Refunds */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Returns &amp; Refunds</h2>
                        <p className="text-gray-700">
                            Returns and refunds are governed by our{' '}
                            <a href="/refund-policy" className="text-blue-600 hover:underline">Refund &amp; Returns Policy</a>.
                            We offer a 14-day return window in accordance with the Consumer Protection Act.
                        </p>
                    </div>

                    {/* 6. Warranty */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Warranty</h2>
                        <p className="text-gray-700">
                            All products sold by GadgetVilla are covered by a warranty of up to 2 years, as detailed
                            in our <a href="/warranty-policy" className="text-blue-600 hover:underline">Warranty Policy</a>.
                            The warranty does not cover damage caused by misuse, unauthorised modifications, or normal wear and tear.
                        </p>
                    </div>

                    {/* 7. Intellectual Property */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Intellectual Property</h2>
                        <ul className="list-none space-y-2 text-gray-700">
                            <li><span className="font-medium">7.1</span> All content on the GadgetVilla website, including text, images, logos, and graphics, is the property of GadgetVilla and is protected by applicable copyright and intellectual property laws.</li>
                            <li><span className="font-medium">7.2</span> You may not reproduce, distribute, or use any content from this website for commercial purposes without our express written permission.</li>
                        </ul>
                    </div>

                    {/* 8. Limitation of Liability */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Limitation of Liability</h2>
                        <ul className="list-none space-y-2 text-gray-700">
                            <li><span className="font-medium">8.1</span> GadgetVilla's liability to you in connection with any order shall not exceed the purchase price paid for the relevant product.</li>
                            <li><span className="font-medium">8.2</span> We are not liable for any indirect, incidental, or consequential damages arising from your use of our website or products.</li>
                            <li><span className="font-medium">8.3</span> Nothing in these Terms limits our liability for death, personal injury caused by our negligence, or any other liability that cannot be excluded by law.</li>
                        </ul>
                    </div>

                    {/* 9. Privacy */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Privacy &amp; Data Protection</h2>
                        <p className="text-gray-700">
                            Your personal information is collected and processed in accordance with our Privacy Statement
                            and the Protection of Personal Information Act (POPIA). We will never sell or share your
                            personal data with third parties for marketing purposes without your consent.
                        </p>
                    </div>

                    {/* 10. Governing Law */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Governing Law</h2>
                        <p className="text-gray-700">
                            These Terms &amp; Conditions are governed by and construed in accordance with the laws of
                            the Republic of South Africa. Any disputes arising out of or in connection with these Terms
                            shall be subject to the exclusive jurisdiction of the South African courts.
                        </p>
                    </div>

                    {/* 11. Contact */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Contact Us</h2>
                        <p className="text-gray-700">
                            If you have any questions about these Terms &amp; Conditions, please contact us at{' '}
                            <a href="mailto:info@gadgetvilla.co.za" className="text-blue-600 hover:underline">
                                info@gadgetvilla.co.za
                            </a>.
                        </p>
                    </div>

                    <p className="text-gray-700 mt-10 pt-6 border-t border-gray-200 text-sm">
                        GadgetVilla operates in accordance with the Consumer Protection Act (No. 68 of 2008),
                        the Electronic Communications and Transactions Act (No. 25 of 2002), and the Protection
                        of Personal Information Act (No. 4 of 2013).
                    </p>
                </section>
            </StorefrontLayout>
        </>
    );
}


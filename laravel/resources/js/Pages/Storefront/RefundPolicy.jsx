import { Head } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';

export default function RefundPolicy() {
    return (
        <>
            <Head title="Refund & Returns Policy – GadgetVilla" />
            <StorefrontLayout>
                <section className="mx-auto max-w-4xl px-4 py-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Refund &amp; Returns Policy</h1>

                    {/* Overview */}
                    <div className="mb-8">
                        <p className="text-gray-700 mb-4">
                            At GadgetVilla, we want you to be completely satisfied with your purchase. If for any
                            reason you are not happy with your order, we offer a straightforward 14-day return and
                            refund policy in accordance with the Consumer Protection Act (CPA).
                        </p>
                        <p className="text-gray-700">
                            Please read the following carefully to ensure you understand your rights and our process
                            before initiating a return. For any queries, contact us at{' '}
                            <a href="mailto:info@gadgetvilla.co.za" className="text-blue-600 hover:underline">
                                info@gadgetvilla.co.za
                            </a>.
                        </p>
                    </div>

                    {/* 14-Day Return Window */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">14-Day Return Window</h2>
                        <p className="text-gray-700 mb-3">
                            You may return any item purchased from GadgetVilla within <strong>14 days</strong> of
                            delivery for a full refund or exchange, provided the following conditions are met:
                        </p>
                        <ul className="list-none space-y-2 text-gray-700">
                            <li><span className="font-medium">a)</span> The item is in its original, unused condition and has not been damaged, altered, or tampered with.</li>
                            <li><span className="font-medium">b)</span> All original packaging, accessories, manuals, and proof of purchase are included.</li>
                            <li><span className="font-medium">c)</span> The item is not excluded from our returns policy (see Exclusions below).</li>
                            <li><span className="font-medium">d)</span> A return request has been submitted to <a href="mailto:info@gadgetvilla.co.za" className="text-blue-600 hover:underline">info@gadgetvilla.co.za</a> within the 14-day period.</li>
                        </ul>
                    </div>

                    {/* How to Initiate a Return */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">How to Initiate a Return</h2>
                        <ul className="list-none space-y-2 text-gray-700">
                            <li><span className="font-medium">1.</span> Email <a href="mailto:info@gadgetvilla.co.za" className="text-blue-600 hover:underline">info@gadgetvilla.co.za</a> with your order number, the item(s) you wish to return, and the reason for the return.</li>
                            <li><span className="font-medium">2.</span> Our team will review your request and respond within 2 business days with return instructions and a return authorisation number.</li>
                            <li><span className="font-medium">3.</span> Securely package the item(s) with all original contents and ship them to the address provided in the return instructions.</li>
                            <li><span className="font-medium">4.</span> Once we receive and inspect the returned item(s), we will process your refund or exchange within 5–7 business days.</li>
                        </ul>
                    </div>

                    {/* Refund Method */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">Refund Method</h2>
                        <p className="text-gray-700 mb-3">
                            Approved refunds will be processed using the original payment method. Please allow
                            up to <strong>7 business days</strong> for the funds to reflect in your account,
                            depending on your bank or payment provider.
                        </p>
                        <p className="text-gray-700">
                            GadgetVilla reserves the right to deduct a handling or restocking fee where applicable
                            if the item is not returned in its original condition.
                        </p>
                    </div>

                    {/* Defective or Incorrect Items */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">Defective or Incorrect Items</h2>
                        <p className="text-gray-700 mb-3">
                            If you receive a defective, damaged, or incorrect item, please contact us within
                            <strong> 48 hours</strong> of delivery at{' '}
                            <a href="mailto:info@gadgetvilla.co.za" className="text-blue-600 hover:underline">
                                info@gadgetvilla.co.za
                            </a>{' '}
                            with photographic evidence of the issue.
                        </p>
                        <ul className="list-none space-y-2 text-gray-700">
                            <li><span className="font-medium">a)</span> We will arrange a free collection of the defective or incorrect item at no cost to you.</li>
                            <li><span className="font-medium">b)</span> A replacement item will be dispatched, or a full refund will be issued, at your discretion.</li>
                        </ul>
                    </div>

                    {/* Exclusions */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">Exclusions</h2>
                        <p className="text-gray-700 mb-3">The following items are not eligible for return or refund:</p>
                        <ul className="list-none space-y-2 text-gray-700">
                            <li><span className="font-medium">a)</span> Items that have been used, damaged, or show signs of wear.</li>
                            <li><span className="font-medium">b)</span> Items returned without their original packaging, accessories, or proof of purchase.</li>
                            <li><span className="font-medium">c)</span> Software, digital downloads, or items with broken seals where the seal protects intellectual property.</li>
                            <li><span className="font-medium">d)</span> Items that have been physically damaged by the customer after delivery.</li>
                            <li><span className="font-medium">e)</span> Special-order or custom-configured items, unless they arrive defective.</li>
                        </ul>
                    </div>

                    {/* Return Shipping */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">Return Shipping Costs</h2>
                        <p className="text-gray-700">
                            For change-of-mind returns, the customer is responsible for the return shipping costs.
                            For defective, damaged, or incorrect items, GadgetVilla will cover the cost of return
                            shipping in full.
                        </p>
                    </div>

                    <p className="text-gray-700 mt-10 pt-6 border-t border-gray-200 text-sm">
                        GadgetVilla operates in terms of the requirements of the Consumer Protection Act (No. 68 of 2008).
                        This policy does not affect your statutory rights.
                    </p>
                </section>
            </StorefrontLayout>
        </>
    );
}


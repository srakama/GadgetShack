import { Head } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';

export default function WarrantyPolicy() {
    return (
        <>
            <Head title="Warranty Policy – GadgetShack" />
            <StorefrontLayout>
                <section className="mx-auto max-w-4xl px-4 py-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Warranty Policy</h1>

                    {/* Overview */}
                    <div className="mb-8">
                        <p className="text-gray-700 mb-4">
                            At GadgetShack, every product we sell is backed by a warranty of <strong>up to 2 years</strong>,
                            giving you complete peace of mind with your purchase. Our warranty covers manufacturing defects
                            and hardware failures under normal use conditions.
                        </p>
                        <p className="text-gray-700">
                            For warranty-related queries, please contact us at{' '}
                            <a href="mailto:info@gadgetshack.co.za" className="text-blue-600 hover:underline">
                                info@gadgetshack.co.za
                            </a>.
                        </p>
                    </div>

                    {/* Warranty Periods */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">Warranty Periods</h2>
                        <p className="text-gray-700 mb-4">
                            Warranty periods vary by product category. The warranty period begins on the date of
                            delivery to the customer.
                        </p>
                        <div className="overflow-x-auto rounded-lg border border-gray-200">
                            <table className="min-w-full text-sm text-gray-700">
                                <thead className="bg-gray-100 text-gray-800 font-semibold">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Product Category</th>
                                        <th className="px-4 py-3 text-left">Warranty Period</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    <tr className="bg-white"><td className="px-4 py-3">Laptops &amp; Computers</td><td className="px-4 py-3">Up to 2 Years</td></tr>
                                    <tr className="bg-gray-50"><td className="px-4 py-3">Smartphones &amp; Tablets</td><td className="px-4 py-3">Up to 1 Year</td></tr>
                                    <tr className="bg-white"><td className="px-4 py-3">Monitors &amp; Displays</td><td className="px-4 py-3">Up to 2 Years</td></tr>
                                    <tr className="bg-gray-50"><td className="px-4 py-3">Peripherals &amp; Accessories</td><td className="px-4 py-3">Up to 1 Year</td></tr>
                                    <tr className="bg-white"><td className="px-4 py-3">Networking Equipment</td><td className="px-4 py-3">Up to 1 Year</td></tr>
                                    <tr className="bg-gray-50"><td className="px-4 py-3">Storage Devices</td><td className="px-4 py-3">Up to 2 Years</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="mt-3 text-sm text-gray-600 italic">
                            The exact warranty period for a specific product is indicated on the product listing page.
                        </p>
                    </div>

                    {/* What is Covered */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">What is Covered</h2>
                        <ul className="list-none space-y-2 text-gray-700">
                            <li><span className="font-medium">a)</span> Manufacturing defects and workmanship faults present at the time of purchase.</li>
                            <li><span className="font-medium">b)</span> Hardware component failures under normal operating conditions.</li>
                            <li><span className="font-medium">c)</span> Battery defects (where the battery retains less than 80% of its original capacity within the warranty period under normal use).</li>
                            <li><span className="font-medium">d)</span> Display defects including dead pixels exceeding the manufacturer's threshold.</li>
                        </ul>
                    </div>

                    {/* What is Not Covered */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">What is Not Covered</h2>
                        <ul className="list-none space-y-2 text-gray-700">
                            <li><span className="font-medium">a)</span> Physical damage caused by drops, impacts, liquid spills, or misuse.</li>
                            <li><span className="font-medium">b)</span> Damage caused by unauthorised repairs, modifications, or tampering.</li>
                            <li><span className="font-medium">c)</span> Normal wear and tear, including cosmetic damage such as scratches or dents.</li>
                            <li><span className="font-medium">d)</span> Damage caused by use of incompatible accessories, chargers, or power supplies.</li>
                            <li><span className="font-medium">e)</span> Software issues, viruses, or data loss.</li>
                            <li><span className="font-medium">f)</span> Products with tampered, removed, or illegible serial numbers.</li>
                        </ul>
                    </div>

                    {/* How to Claim */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">How to Claim a Warranty</h2>
                        <ul className="list-none space-y-2 text-gray-700">
                            <li><span className="font-medium">1.</span> Email <a href="mailto:info@gadgetshack.co.za" className="text-blue-600 hover:underline">info@gadgetshack.co.za</a> with your order number, a description of the fault, and supporting photographs or video evidence.</li>
                            <li><span className="font-medium">2.</span> Our support team will assess your claim within 2–3 business days and provide return instructions if the claim is approved.</li>
                            <li><span className="font-medium">3.</span> Send the product to us in its original or adequate protective packaging. GadgetShack will cover the cost of return shipping for valid warranty claims.</li>
                            <li><span className="font-medium">4.</span> Upon receipt, our technicians will inspect the product. If the defect is confirmed, we will repair or replace the product at no cost to you, or issue a full refund at our discretion.</li>
                        </ul>
                    </div>

                    {/* Warranty Resolution */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">Warranty Resolution Options</h2>
                        <p className="text-gray-700 mb-3">
                            Depending on stock availability and the nature of the defect, GadgetShack will offer one
                            of the following resolutions:
                        </p>
                        <ul className="list-none space-y-2 text-gray-700">
                            <li><span className="font-medium">a)</span> <strong>Repair</strong> — the defective unit will be repaired and returned to you.</li>
                            <li><span className="font-medium">b)</span> <strong>Replacement</strong> — the defective unit will be replaced with an identical or equivalent model.</li>
                            <li><span className="font-medium">c)</span> <strong>Refund</strong> — a full refund will be issued via the original payment method where repair or replacement is not possible.</li>
                        </ul>
                    </div>

                    <p className="text-gray-700 mt-10 pt-6 border-t border-gray-200 text-sm">
                        GadgetShack's warranty policy is offered in addition to, and does not limit, your statutory
                        rights under the Consumer Protection Act (No. 68 of 2008).
                    </p>
                </section>
            </StorefrontLayout>
        </>
    );
}


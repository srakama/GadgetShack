import { Head } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';

export default function ShippingPolicy() {
    return (
        <>
            <Head title="Shipping Policy – GadgetVilla" />
            <StorefrontLayout>
                <section className="mx-auto max-w-4xl px-4 py-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Shipping Policy</h1>

                    {/* Types of delivery */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">Types of Delivery</h2>
                        <p className="text-gray-700 mb-4">
                            We offer delivery of purchased products by courier within 3 – 7 working days.
                            The table below shows estimated delivery times, which is in addition to GadgetVilla's
                            internal processing times.
                        </p>
                        <div className="overflow-x-auto rounded-lg border border-gray-200">
                            <table className="min-w-full text-sm text-gray-700">
                                <thead className="bg-gray-100 text-gray-800 font-semibold">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Time of Order</th>
                                        <th className="px-4 py-3 text-left">Processing at GadgetVilla</th>
                                        <th className="px-4 py-3 text-left">To JHB</th>
                                        <th className="px-4 py-3 text-left">To Main City Centres</th>
                                        <th className="px-4 py-3 text-left">To Outlying &amp; Remote Areas</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    <tr className="bg-white">
                                        <td className="px-4 py-3">Mon – Fri</td>
                                        <td className="px-4 py-3">Two working days</td>
                                        <td className="px-4 py-3">2–3 working days</td>
                                        <td className="px-4 py-3">3–4 working days</td>
                                        <td className="px-4 py-3">4–7 working days</td>
                                    </tr>
                                    <tr className="bg-gray-50">
                                        <td className="px-4 py-3">Weekends</td>
                                        <td className="px-4 py-3">From Tuesday onwards</td>
                                        <td className="px-4 py-3">2–3 working days</td>
                                        <td className="px-4 py-3">3–4 working days</td>
                                        <td className="px-4 py-3">4–7 working days</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="mt-3 text-sm text-gray-600 italic">
                            Kindly note that the above timings may be extended during busy trading periods,
                            e.g. long weekends, Easter, Black November and the Festive Season.
                        </p>
                    </div>

                    {/* Delivery fees */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">Delivery Fees</h2>
                        <p className="text-gray-700">
                            Delivery is free within the Republic of South Africa for all orders over
                            R649 (six hundred and forty-nine Rand) including VAT. For orders under R649,
                            a R100 (one hundred Rand) delivery fee will apply.
                        </p>
                    </div>

                    {/* Delivery particulars */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">Delivery Particulars</h2>
                        <p className="text-gray-700 mb-3">
                            Our current courier service provider is Aramex Couriers. Please ignore any email
                            you may receive with any courier branding requesting payment for the courier service.
                        </p>
                        <ul className="list-none space-y-2 text-gray-700">
                            <li><span className="font-medium">a)</span> Deliveries will take place during office hours (9am to 5pm, Monday to Friday), excluding public holidays.</li>
                            <li><span className="font-medium">b)</span> Please watch for an SMS on the day of delivery. The Aramex driver will only phone you upon arrival at your location.</li>
                            <li><span className="font-medium">c)</span> Delivery of completed transactions will commence upon payment confirmation.</li>
                            <li><span className="font-medium">d)</span> You will be notified in writing to your supplied email address regarding the delivery process.</li>
                            <li><span className="font-medium">e)</span> Goods must be signed for upon delivery and by the person named in the shipping information.</li>
                            <li><span className="font-medium">f)</span> Should your order comprise items sourced from multiple locations, you may receive more than one delivery.</li>
                        </ul>
                    </div>

                    {/* Delivery delays */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">Delivery Delays</h2>
                        <p className="text-gray-700">
                            Whilst every effort will be made to ensure timeous delivery, you will be notified
                            in writing to your supplied email address should there be any delays.
                        </p>
                    </div>

                    {/* Failed deliveries */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">Failed Deliveries</h2>
                        <p className="text-gray-700">
                            You will be notified in writing to your supplied email address should there be a
                            failure in delivering your product to you at the physical address you supplied when
                            making your purchase. Charges may apply to multiple failed deliveries.
                        </p>
                    </div>

                    {/* Inspection of goods */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">Inspection of Goods / Damages</h2>
                        <ul className="list-none space-y-2 text-gray-700">
                            <li><span className="font-medium">a)</span> Please ensure you inspect your goods prior to signing the delivery document to ensure that all packaging has been sealed and is intact.</li>
                            <li><span className="font-medium">b)</span> Should there be any damage to the packaging, ensure the delivery document is endorsed accordingly and reject your delivery or else take a video when opening the parcel.</li>
                            <li><span className="font-medium">c)</span> Please be kind enough to email this rejection of delivery to <a href="mailto:info@gadgetvilla.co.za" className="text-blue-600 hover:underline">info@gadgetvilla.co.za</a>.</li>
                        </ul>
                    </div>

                    {/* Order tracking */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">Order Tracking</h2>
                        <p className="text-gray-700">
                            You will be notified in writing to your supplied email address or via SMS on how
                            you can track the delivery status of your purchase.
                        </p>
                    </div>

                    {/* Returned orders */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">Returned Orders</h2>
                        <ul className="list-none space-y-2 text-gray-700">
                            <li><span className="font-medium">a)</span> You can return your item to GadgetVilla for a full refund or exchange, subject to our Returns Policy.</li>
                            <li><span className="font-medium">b)</span> Please ensure you include all packaging, manual(s) and accessories to allow us to process the return.</li>
                        </ul>
                    </div>

                    <p className="text-gray-700 mt-10 pt-6 border-t border-gray-200 text-sm">
                        GadgetVilla operates in terms of the requirements of the Consumer Protection Act.
                    </p>
                </section>
            </StorefrontLayout>
        </>
    );
}


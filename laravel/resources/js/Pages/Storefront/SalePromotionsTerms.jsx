import { Head } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';

export default function SalePromotionsTerms() {
    return (
        <>
            <Head title="Sale & Promotions Terms – GadgetVilla" />
            <StorefrontLayout>
                <section className="mx-auto max-w-4xl px-4 py-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Sale &amp; Promotions Terms &amp; Conditions</h1>
                    <p className="text-sm text-gray-500 mb-8">Last updated: March 2026</p>

                    {/* Introduction */}
                    <div className="mb-8">
                        <p className="text-gray-700 mb-4">
                            These Sale &amp; Promotions Terms &amp; Conditions ("Promotions Terms") govern all sales,
                            discounts, promotional offers, voucher codes, and special events conducted by GadgetVilla
                            ("we", "us", "our"). By participating in any promotion, you agree to be bound by these
                            Promotions Terms as well as our general{' '}
                            <a href="/terms-conditions" className="text-blue-600 hover:underline">Terms &amp; Conditions</a>.
                        </p>
                        <p className="text-gray-700">
                            All promotions are subject to the Consumer Protection Act (No. 68 of 2008) and are valid
                            while stocks last unless otherwise stated.
                        </p>
                    </div>

                    {/* 1. General */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">1. General Conditions</h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li>All promotional prices are valid for the specified promotional period only and are subject to change without prior notice.</li>
                            <li>Promotions apply to stock available at the time of purchase and are valid while stocks last.</li>
                            <li>GadgetVilla reserves the right to limit the quantity of promotional items purchased per customer.</li>
                            <li>Promotions cannot be combined with other offers unless explicitly stated.</li>
                            <li>GadgetVilla reserves the right to cancel, modify, or extend any promotion at any time without prior notice.</li>
                            <li>In the event of a pricing error, GadgetVilla reserves the right to cancel the order and issue a full refund.</li>
                        </ul>
                    </div>

                    {/* 2. Promotional Pricing */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Promotional Pricing &amp; Discounts</h2>
                        <ul className="list-none space-y-2 text-gray-700">
                            <li><span className="font-medium">2.1</span> Sale prices displayed on our website reflect the discount already applied. The original price shown represents the price at which the product was previously offered.</li>
                            <li><span className="font-medium">2.2</span> Discounts apply only to the items specified in the promotion and do not extend to accessories, warranties, or other products unless explicitly stated.</li>
                            <li><span className="font-medium">2.3</span> Promotional pricing is available to all customers unless a promotion is specifically designated as exclusive to registered account holders or newsletter subscribers.</li>
                            <li><span className="font-medium">2.4</span> Once a promotional period ends, items revert to their standard pricing.</li>
                        </ul>
                    </div>

                    {/* 3. Discount Codes & Vouchers */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Discount Codes &amp; Vouchers</h2>
                        <ul className="list-none space-y-2 text-gray-700">
                            <li><span className="font-medium">3.1</span> Discount codes and vouchers must be applied at checkout before payment is finalised. Codes cannot be applied retrospectively to completed orders.</li>
                            <li><span className="font-medium">3.2</span> Each discount code is valid for a single use per customer unless stated otherwise.</li>
                            <li><span className="font-medium">3.3</span> Discount codes are non-transferable and have no cash value.</li>
                            <li><span className="font-medium">3.4</span> GadgetVilla reserves the right to disable or invalidate any discount code that is suspected of misuse or fraud.</li>
                            <li><span className="font-medium">3.5</span> Discount codes cannot be used in conjunction with other promotional codes unless explicitly permitted.</li>
                            <li><span className="font-medium">3.6</span> Vouchers issued as part of a refund or loyalty programme are subject to their own expiry dates and conditions.</li>
                        </ul>
                    </div>

                    {/* 4. Seasonal & Flash Sales */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Seasonal &amp; Flash Sales</h2>
                        <ul className="list-none space-y-2 text-gray-700">
                            <li><span className="font-medium">4.1</span> Seasonal sales (e.g. Black Friday, Cyber Monday, mid-year sales) are valid only for the advertised period and while stocks last.</li>
                            <li><span className="font-medium">4.2</span> Flash sale prices apply only during the specified flash sale window. Orders placed outside this window will not qualify for the promotional price.</li>
                            <li><span className="font-medium">4.3</span> High-demand products during seasonal sales may sell out quickly. Placing an item in your cart does not reserve stock; the promotional price is only guaranteed upon successful payment.</li>
                            <li><span className="font-medium">4.4</span> GadgetVilla will not be liable for any loss or inconvenience arising from stock availability during high-traffic sale events.</li>
                        </ul>
                    </div>

                    {/* 5. Bundle Deals */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Bundle Deals</h2>
                        <ul className="list-none space-y-2 text-gray-700">
                            <li><span className="font-medium">5.1</span> Bundle pricing applies only when all items in the bundle are purchased together in a single transaction.</li>
                            <li><span className="font-medium">5.2</span> Individual items within a bundle may not be returned separately unless the entire bundle is returned in accordance with our{' '}
                                <a href="/refund-policy" className="text-blue-600 hover:underline">Refund Policy</a>.
                            </li>
                            <li><span className="font-medium">5.3</span> If any item within a bundle is out of stock, GadgetVilla reserves the right to offer a substitute item of equal or greater value or cancel the bundle and issue a full refund.</li>
                        </ul>
                    </div>

                    {/* 6. Free Delivery Promotions */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Free Delivery Promotions</h2>
                        <ul className="list-none space-y-2 text-gray-700">
                            <li><span className="font-medium">6.1</span> Free delivery is available on qualifying orders over R649 within South Africa, unless a specific free delivery promotion specifies a different threshold.</li>
                            <li><span className="font-medium">6.2</span> Free delivery promotions apply to standard delivery only. Express or overnight delivery options remain chargeable unless explicitly included in a promotion.</li>
                            <li><span className="font-medium">6.3</span> If an order is partially returned, bringing the order value below the free delivery threshold, GadgetVilla reserves the right to deduct the standard delivery fee from the refund.</li>
                        </ul>
                    </div>

                    {/* 7. Newsletter & Loyalty Promotions */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Newsletter &amp; Loyalty Promotions</h2>
                        <ul className="list-none space-y-2 text-gray-700">
                            <li><span className="font-medium">7.1</span> Exclusive discounts offered to newsletter subscribers are valid for one use per subscriber and are non-transferable.</li>
                            <li><span className="font-medium">7.2</span> Unsubscribing from our newsletter after redeeming a promotional offer will not affect the current order but will result in loss of future subscriber-exclusive promotions.</li>
                            <li><span className="font-medium">7.3</span> GadgetVilla reserves the right to modify or discontinue its loyalty programme at any time with reasonable notice to participants.</li>
                        </ul>
                    </div>

                    {/* 8. Exclusions */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Exclusions</h2>
                        <p className="text-gray-700 mb-3">Unless otherwise stated, the following are excluded from all promotions:</p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li>Items already marked as clearance or end-of-life stock.</li>
                            <li>Gift cards and store credit.</li>
                            <li>Extended warranty or insurance products.</li>
                            <li>Previously placed orders or pre-orders placed before the promotional period.</li>
                            <li>Products from specific excluded brands or categories as noted in the relevant promotion.</li>
                        </ul>
                    </div>

                    {/* 9. Returns During Promotions */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Returns &amp; Refunds on Promotional Purchases</h2>
                        <ul className="list-none space-y-2 text-gray-700">
                            <li><span className="font-medium">9.1</span> Promotional items remain subject to our standard{' '}
                                <a href="/refund-policy" className="text-blue-600 hover:underline">Refund Policy</a> and{' '}
                                <a href="/warranty-policy" className="text-blue-600 hover:underline">Warranty Policy</a>.
                            </li>
                            <li><span className="font-medium">9.2</span> Refunds on promotional purchases will be processed at the price paid, not the original pre-promotional price.</li>
                            <li><span className="font-medium">9.3</span> If a "buy X get Y free" or similar promotion applied to your order and you return the qualifying item, GadgetVilla reserves the right to recover the value of any free item received.</li>
                        </ul>
                    </div>

                    {/* 10. Errors & Omissions */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Errors &amp; Omissions</h2>
                        <p className="text-gray-700">
                            While we take every effort to ensure promotional details are accurate, GadgetVilla shall not
                            be liable for any typographical or pricing errors published in connection with a promotion.
                            In such cases, we reserve the right to cancel affected orders and issue a full refund.
                            Customers will be notified as soon as a material error is identified.
                        </p>
                    </div>

                    {/* 11. Contact */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Contact Us</h2>
                        <p className="text-gray-700">
                            For any queries regarding our promotions, please contact our team at{' '}
                            <a href="mailto:info@gadgetvilla.co.za" className="text-blue-600 hover:underline">
                                info@gadgetvilla.co.za
                            </a>.
                        </p>
                    </div>

                    <p className="text-gray-700 mt-10 pt-6 border-t border-gray-200 text-sm">
                        These Promotions Terms are governed by the laws of the Republic of South Africa, including
                        the Consumer Protection Act (No. 68 of 2008) and the Electronic Communications and
                        Transactions Act (No. 25 of 2002).
                    </p>
                </section>
            </StorefrontLayout>
        </>
    );
}


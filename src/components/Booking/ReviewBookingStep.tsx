// Step 2 এ বসাবে — must have access to `form`
// Example: const form = useForm<FormValues>({...})
// const { control, watch, getValues } = form;

type ReviewProps = {
    form: any;                 // better: UseFormReturn<FormValues>
    onEdit?: () => void;       // optional: step=1 এ ফেরত যাবে
};

const ReviewBookingStep: React.FC<ReviewProps> = ({ form, onEdit }) => {
    // Live update চাইলে watch() use করো
    const data = form.watch(); // step-2 তে আসার পরে step-1 তে কিছু change করলে এখানেও reflect করবে

    const primary = data?.primaryContact;
    const travellers = data?.travellers || [];
    const discountCode = data?.discountCode;
    const referredSalesStaffName = data?.referredSalesStaffName;
    const termsAccepted = data?.termsAccepted;
    const privacyAccepted = data?.privacyAccepted;

    const Row = ({ label, value }: { label: string; value: any }) => (
        <div className="flex items-start justify-between gap-6 border-b border-slate-100 py-2">
            <p className="text-sm font-medium text-slate-600">{label}</p>
            <p className="text-sm font-semibold text-slate-900 text-right wrap-break-words">
                {value ?? <span className="text-slate-400 font-medium">—</span>}
            </p>
        </div>
    );

    const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
        <div className="rounded-xl border border-brand-sand bg-white shadow-lg">
            <div className="px-5 py-3 bg-teal-800 text-white font-semibold rounded-t-xl">
                {title}
            </div>
            <div className="p-5 space-y-1">{children}</div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-slate-900">Review & Payment</h3>
                    <p className="text-sm text-slate-500">
                        Please review your details before proceeding to checkout.
                    </p>
                </div>

                {onEdit ? (
                    <button
                        type="button"
                        onClick={onEdit}
                        className="h-10 rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold hover:bg-slate-50"
                    >
                        Edit Details
                    </button>
                ) : null}
            </div>

            {/* Primary Contact */}
            <Card title="PRIMARY CONTACT">
                <Row label="Name" value={primary?.name} />
                <Row label="Email" value={primary?.email} />
                <Row label="Mobile" value={primary?.mobile} />
                <Row label="Address" value={primary?.address} />
            </Card>

            {/* Travellers */}
            <div className="space-y-4">
                {travellers.length === 0 ? (
                    <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600">
                        No travellers added.
                    </div>
                ) : (
                    travellers.map((t: any, idx: number) => (
                        <Card key={idx} title={`TRAVELLER ${idx + 1}`}>
                            <Row label="Name" value={t?.name} />
                            <Row label="Email" value={t?.email} />
                            <Row label="Mobile" value={t?.mobile} />
                            <Row label="Nationality" value={t?.nationality} />
                            <Row label="Date of Birth" value={t?.dateOfBirth} />
                            <Row label="Passport No." value={t?.passportNo} />
                            <Row label="Expiry Date" value={t?.expiryDate} />
                        </Card>
                    ))
                )}
            </div>

            {/* Discount + Staff */}
            <Card title="DISCOUNT & REFERRAL">
                <Row label="Discount Code" value={discountCode || "—"} />
                <Row label="Referred Sales Staff" value={referredSalesStaffName || "—"} />
            </Card>

            {/* Agreements */}
            <Card title="AGREEMENTS">
                <Row label="Accepted Terms" value={termsAccepted ? "Yes" : "No"} />
                <Row label="Accepted Privacy Policy" value={privacyAccepted ? "Yes" : "No"} />
            </Card>

            {/* Payment placeholder */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-lg">
                <p className="text-sm font-semibold text-slate-800">Payment Method</p>
                <p className="mt-1 text-sm text-slate-500">
                    Put your payment UI here (card/bank/paynow etc.)
                </p>
            </div>
        </div>
    );
};

export default ReviewBookingStep;

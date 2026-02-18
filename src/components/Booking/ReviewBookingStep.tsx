type ReviewProps = {
  form: any;
  onEdit?: () => void;
  adultCount: number; // Add this
};

const ReviewBookingStep: React.FC<ReviewProps> = ({
  form,
  onEdit,
  adultCount,
}) => {
  // Live update 
  const data = form.watch();

  const primary = data?.primaryContact;
  const travellers = data?.travellers || [];
  const discountCode = data?.discountCode;
  const referredSalesStaffName = data?.referredSalesStaffName;
  const isTermsAccepted = data?.termsAccepted;
  const isPrivacyAccepted = data?.privacyAccepted;

  // Helper for rows
  const Row = ({ label, value }: { label: string; value: any }) => (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <span className="text-sm font-semibold text-gray-900 text-right max-w-[60%] break-words">
        {value || <span className="text-gray-400 italic">Not provided</span>}
      </span>
    </div>
  );

  // Helper for cards
  const Card = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="rounded-xl border border-brand-sand bg-white shadow-sm overflow-hidden mb-6 last:mb-0">
      <div className="px-5 py-3 bg-teal-800 text-white font-bold text-sm tracking-wide uppercase">
        {title}
      </div>
      <div className="p-5 space-y-1">{children}</div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-blue-900">
            Review Your Details
          </h3>
          <p className="text-sm text-blue-700 mt-1">
            Please ensure all information is correct before proceeding to
            payment.
          </p>
        </div>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline px-2 py-1"
          >
            Edit
          </button>
        )}
      </div>

      {/* Primary Contact */}
      <Card title="Primary Contact">
        <Row label="Name" value={primary?.name} />
        <Row label="Email" value={primary?.email} />
        <Row label="Mobile" value={primary?.mobile} />
        <Row label="Address" value={primary?.address} />
      </Card>

      {/* Travellers */}
      <div className="space-y-6">
        {travellers.length === 0 ? (
          <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200 text-gray-500 italic">
            No travellers added.
          </div>
        ) : (
          travellers.map((t: any, idx: number) => (
            <Card
              key={idx}
              title={`Traveller ${idx + 1} - ${idx < adultCount ? "ADULT" : "CHILD"}`}
            >
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
      {(discountCode || referredSalesStaffName) && (
        <Card title="Additional Information">
          {discountCode && <Row label="Discount Code" value={discountCode} />}
          {referredSalesStaffName && (
            <Row label="Referred By" value={referredSalesStaffName} />
          )}
        </Card>
      )}

      {/* Agreements */}
      <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 text-sm">
        <div className="flex items-center gap-2 mb-2">
          <span
            className={isTermsAccepted ? "text-green-600" : "text-gray-400"}
          >
            {isTermsAccepted ? "✔" : "○"}
          </span>
          <span className="text-gray-700">Terms and Conditions Accepted</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={isPrivacyAccepted ? "text-green-600" : "text-gray-400"}
          >
            {isPrivacyAccepted ? "✔" : "○"}
          </span>
          <span className="text-gray-700">Privacy Policy Accepted</span>
        </div>
      </div>
    </div>
  );
};

export default ReviewBookingStep;

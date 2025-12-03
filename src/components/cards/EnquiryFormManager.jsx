import React from 'react';
import { FiMail, FiUser, FiPhone, FiMessageSquare } from 'react-icons/fi';

const EnquiryFormManager = ({ enquiryForm, onUpdate }) => {
  const availableFields = [
    { id: 'name', label: 'Name', icon: <FiUser /> },
    { id: 'email', label: 'Email', icon: <FiMail /> },
    { id: 'phone', label: 'Phone', icon: <FiPhone /> },
    { id: 'message', label: 'Message', icon: <FiMessageSquare /> }
  ];

  const handleToggleEnabled = () => {
    onUpdate({ ...enquiryForm, enabled: !enquiryForm.enabled });
  };

  const handleToggleField = (fieldId) => {
    const fields = enquiryForm.fields.includes(fieldId)
      ? enquiryForm.fields.filter(f => f !== fieldId)
      : [...enquiryForm.fields, fieldId];
    onUpdate({ ...enquiryForm, fields });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Enquiry Form Settings</h3>
        <p className="text-sm text-gray-600 mb-4">
          Enable an enquiry form to let visitors contact you directly from your digital card.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <label className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-3">
            <FiMail className="text-blue-600" size={24} />
            <div>
              <p className="font-semibold text-gray-800">Enable Enquiry Form</p>
              <p className="text-sm text-gray-600">Allow visitors to send enquiries via WhatsApp</p>
            </div>
          </div>
          <div className="relative">
            <input
              type="checkbox"
              checked={enquiryForm.enabled}
              onChange={handleToggleEnabled}
              className="sr-only peer"
            />
            <div className="w-14 h-8 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
          </div>
        </label>
      </div>

      {enquiryForm.enabled && (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Form Fields</h4>
            <p className="text-sm text-gray-600 mb-4">
              Select which fields to include in your enquiry form
            </p>
          </div>

          <div className="space-y-2">
            {availableFields.map((field) => (
              <label
                key={field.id}
                className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={enquiryForm.fields.includes(field.id)}
                  onChange={() => handleToggleField(field.id)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <div className="text-gray-600">{field.icon}</div>
                <span className="font-medium text-gray-700">{field.label}</span>
              </label>
            ))}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Enquiries will be sent directly to your WhatsApp number. Make sure to add your WhatsApp number in the Buttons section.
            </p>
          </div>
        </div>
      )}

      {!enquiryForm.enabled && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <FiMail className="mx-auto text-gray-400 mb-3" size={48} />
          <p className="text-gray-600">Enable enquiry form to configure fields</p>
        </div>
      )}
    </div>
  );
};

export default EnquiryFormManager;

import React, { useState } from 'react';

interface Contract {
  id: number;
  name: string;
  address: string;
  network: string;
  version: string;
  status: string;
  lastInteraction: string;
  creationDate: string;
  deployer: string;
  transactions: number;
  gasUsed: string;
  description: string;
}

interface EditContractFormProps {
  contract: Contract;
  onSubmit: (contract: Contract) => void;
  onCancel: () => void;
}

const EditContractForm: React.FC<EditContractFormProps> = ({ contract, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(contract);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Contract Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Network</label>
        <select
          name="network"
          value={formData.network}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="Mainnet">Mainnet</option>
          <option value="Goerli">Goerli</option>
          <option value="Sepolia">Sepolia</option>
          <option value="Arbitrum">Arbitrum</option>
          <option value="Optimism">Optimism</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Version</label>
        <input
          type="text"
          name="version"
          value={formData.version}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="Active">Active</option>
          <option value="Paused">Paused</option>
          <option value="Deprecated">Deprecated</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        ></textarea>
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-900"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default EditContractForm; 
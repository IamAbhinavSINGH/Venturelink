"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axios from 'axios';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronRight } from 'lucide-react';

type Company = {
  id: string;
  name: string;
  role: string;
  website: string;
  country: string;
};

type NewCompanyDetails = { 
  name: string;
  capitalRaised: string;
  website: string;
  address: string;
  description: string;
  teamMembers: string;
  country: string;
  entityType: string;
  bankInfo: string;
};

const entityTypes = ["Ccorp", "LLC", "PBC"];
const countries = ["United States", "Canada", "United Kingdom", "Australia", "India"]; // Add more countries or use a library for a complete list.

export default function CompanySelection() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [newCompany, setNewCompany] = useState<NewCompanyDetails>({
    name: '',
    capitalRaised: '',
    website: '',
    address: '',
    description: '',
    country: '',
    entityType: '',
    bankInfo: '',
    teamMembers: ''
  });

  const fetchCompanies = async () => {
    try {
      const res = await axios.get('/api/founder/company');
      setCompanies(res?.data?.company || []);
    } catch (err) {
      console.log('Error while fetching companies', err);
      setCompanies([]);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
        const res = await axios.post('/api/founder/company', newCompany);
        console.log('res : ', res);

        if (res && res.status === 200) {
            router.push(`/founder/dashboard?company=${res.data.companyId}`);
        }
    } catch (err : any) {
        if (err.response && err.response.data) {
            setError(err.response.data.message);
        } else {
            console.log('Error while creating company', err);
            setError('Could not create company! Please try again later.');
        }
    }
  };


  const handleSelectCompany = (companyId: number) => {
    router.push(`/founder/dashboard?company=${companyId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-8">Tell us about your company</h1>
        
        <div className="flex justify-center space-x-4 mb-8">
          <Button variant={isCreating ? "outline" : "default"} onClick={() => setIsCreating(false)}>
            Choose existing
          </Button>
          <Button variant={isCreating ? "default" : "outline"} onClick={() => setIsCreating(true)}>
            Add new
          </Button>
        </div>

        {isCreating ? (
          <div className="max-w-lg mx-auto">

            {
              (error && error.length > 0) ? 
                  <div className='my-4'>
                    <p className='text-red-500 text-sm'>{error}</p>
                  </div>
              : null
            } 
           
            <form onSubmit={handleCreateCompany} className="space-y-6 w-3/4 mx-auto">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-start">Company Name</Label>
                <Input 
                  id="name" 
                  value={newCompany.name}
                  onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capitalRaised" className="flex items-start">Total Capital Raised</Label>
                <Input 
                  id="capitalRaised" 
                  type='number'
                  value={newCompany.capitalRaised}
                  onChange={(e) => setNewCompany({ ...newCompany, capitalRaised: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website" className="flex items-start">Website</Label>
                <Input 
                  id="website" 
                  value={newCompany.website}
                  onChange={(e) => setNewCompany({ ...newCompany, website: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teamMembers" className="flex items-start">Team Members</Label>
                <Input 
                  id="teamMembers" 
                  type="number"
                  value={newCompany.teamMembers}
                  onChange={(e) => setNewCompany({ ...newCompany, teamMembers: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-start">Address</Label>
                <Input 
                  id="address" 
                  value={newCompany.address}
                  onChange={(e) => setNewCompany({ ...newCompany, address: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country" className="flex items-start">Country</Label>
                <select 
                  id="country"
                  value={newCompany.country}
                  onChange={(e) => setNewCompany({ ...newCompany, country: e.target.value })}
                  required
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select a country</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="entityType" className="flex items-start">Entity Type</Label>
                <select 
                  id="entityType"
                  value={newCompany.entityType}
                  onChange={(e) => setNewCompany({ ...newCompany, entityType: e.target.value })}
                  required
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select an entity type</option>
                  {entityTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankInfo" className="flex items-start">Bank Information</Label>
                <Input 
                  id="bankInfo" 
                  value={newCompany.bankInfo}
                  onChange={(e) => setNewCompany({ ...newCompany, bankInfo: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="flex items-start">Company Description</Label>
                <Textarea 
                  id="description" 
                  value={newCompany.description}
                  onChange={(e) => setNewCompany({ ...newCompany, description: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-3/4 mx-auto">Create Company</Button>
            </form>
          </div>              
        ) : (
            <div className="space-y-4 flex flex-col items-center">
            {companies.length > 0 ? companies.map((company) => (
              <Card 
                key={company.id} 
                className="cursor-pointer border-stone-400 hover:bg-gray-300 w-full max-w-[500px] sm:w-[90%] md:w-[80%] lg:w-[500px]" 
                onClick={() => handleSelectCompany(Number(company.id))}
              >
                <CardContent className="flex items-center justify-between p-2">
                  <div className="flex items-center justify-center space-x-2">
                    <Avatar className="w-10 h-10 bg-gray-400 items-center justify-center">
                      <AvatarFallback className="text-lg font-semibold">{company.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="pl-4">
                      <h2 className="text-lg flex justify-start font-semibold">{company.name}</h2>
                      <p className="text-gray-500 text-sm flex justify-start">Admin</p>
                      <p className="text-gray-500 text-sm flex justify-start">{company.website}</p>
                    </div>
                  </div>
                  <ChevronRight className="text-gray-900" />
                </CardContent>
              </Card>
            )) : (
              <div className="flex justify-center items-center">
                <p className="text-lg text-gray-700 font-semibold">You do not have any existing companies!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

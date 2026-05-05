import { useState, useEffect } from 'react';

interface UsePackagesReturn {
  availablePackages: string[];
  isPackageAvailable: (packageName: string) => boolean;
  isLoading: boolean;
}

export const usePackages = (): UsePackagesReturn => {
  const [availablePackages, setAvailablePackages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPackages = async () => {
      try {
        const packages = await (window as any).app.getAvailablePackages();
        setAvailablePackages(packages || []);
      } catch (error) {
        console.error('Failed to load packages:', error);
        setAvailablePackages([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadPackages();
  }, []);

  const isPackageAvailable = (packageName: string): boolean => {
    return availablePackages.includes(packageName);
  };

  return {
    availablePackages,
    isPackageAvailable,
    isLoading,
  };
};
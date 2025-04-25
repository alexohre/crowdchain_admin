import {ChevronLeft} from "lucide-react"
import {ChevronRight} from "lucide-react"

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export function Pagination({ 
    currentPage, 
    totalPages, 
    goToPage,
    goToPreviousPage, 
    goToNextPage,
    hasNextPage,
    hasPreviousPage
  }: PaginationProps) {
    // Generate page numbers to display
    const getPageNumbers = () => {
      const pages = [];
      // Show at most 5 page numbers including current
      const maxPagesToShow = 5;
      
      if (totalPages <= maxPagesToShow) {
        // If total pages is less than max, show all pages
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show pages around current page
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = startPage + maxPagesToShow - 1;
        
        // Adjust if end exceeds total
        if (endPage > totalPages) {
          endPage = totalPages;
          startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
          pages.push(i);
        }
      }
      
      return pages;
    };
    
    const pageNumbers = getPageNumbers();
    
    if (totalPages <= 1) return null;
    
    return (
      <div className="flex items-center justify-center mt-6 gap-2">
        <button
          onClick={goToPreviousPage}
          disabled={!hasPreviousPage}
          className={`px-3 py-1 rounded border ${
            hasPreviousPage ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'
          }`}
        >
          <ChevronLeft/>
        </button>
        
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => goToPage(number)}
            className={`px-3 py-1 rounded ${
              currentPage === number
                ? 'bg-green-700 text-white'
                : 'hover:bg-gray-100'
            }`}
          >
            {number}
          </button>
        ))}
        
        <button
          onClick={goToNextPage}
          disabled={!hasNextPage}
          className={`px-3 py-1 rounded border ${
            hasNextPage ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'
          }`}
        >
          <ChevronRight/>
        </button>
      </div>
    );
  }
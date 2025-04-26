export function PaginationInfo({ currentPage, itemsPerPage, totalItems }: { currentPage: number; itemsPerPage: number; totalItems: number }) {
    // Calculate the range of items being displayed
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(startItem + itemsPerPage - 1, totalItems);
    
    return (
      <div className="text-sm text-gray-600">
        Showing {startItem} to {endItem} of {totalItems} results
      </div>
    );
  }
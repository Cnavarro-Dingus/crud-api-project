import React from "react";
import { Pagination } from "react-bootstrap";

const PaginationComponent = ({ totalCount, itemsPerPage, currentPage, onPageChange }) => {
  return (
    <Pagination className="mt-4 justify-content-center pagination-container">
      {totalCount > itemsPerPage && (
        <>
          <Pagination.First
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
          />
          <Pagination.Prev
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          />

          {[...Array(Math.ceil(totalCount / itemsPerPage)).keys()].map(
            (number) => {
              const pageNumber = number + 1;
              if (
                pageNumber === 1 ||
                pageNumber === Math.ceil(totalCount / itemsPerPage) ||
                (pageNumber >= currentPage - 1 &&
                  pageNumber <= currentPage + 1)
              ) {
                return (
                  <Pagination.Item
                    key={pageNumber}
                    active={pageNumber === currentPage}
                    onClick={() => onPageChange(pageNumber)}
                  >
                    {pageNumber}
                  </Pagination.Item>
                );
              } else if (
                (pageNumber === 2 && currentPage > 3) ||
                (pageNumber ===
                  Math.ceil(totalCount / itemsPerPage) - 1 &&
                  currentPage < Math.ceil(totalCount / itemsPerPage) - 2)
              ) {
                return <Pagination.Ellipsis key={`ellipsis-${pageNumber}`} />;
              }
              return null;
            }
          )}

          <Pagination.Next
            onClick={() =>
              onPageChange(
                Math.min(
                  Math.ceil(totalCount / itemsPerPage),
                  currentPage + 1
                )
              )
            }
            disabled={currentPage === Math.ceil(totalCount / itemsPerPage)}
          />
          <Pagination.Last
            onClick={() =>
              onPageChange(Math.ceil(totalCount / itemsPerPage))
            }
            disabled={currentPage === Math.ceil(totalCount / itemsPerPage)}
          />
        </>
      )}
    </Pagination>
  );
};

export default PaginationComponent;
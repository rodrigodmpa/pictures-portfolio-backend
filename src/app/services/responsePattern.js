function error(msg) {
  return {
    status: 'error',
    error: msg || 'Internal server error.',
  };
}
function success() {
  return {
    status: 'ok',
    status_code: 200,
  };
}
function pagination(currentPage, elementsPerPage, totalElements) {
  const totalPages = Math.ceil(totalElements / elementsPerPage);
  const pagination_info = {
    current_page: currentPage,
    elements_per_page: elementsPerPage,
    total_pages: totalPages,
    total_elements: totalElements,
  };
  return { pagination_info };
}

export { pagination, error, success };

let API = import.meta.env.VITE_API_URL
if (!API) {
    // If running on Vite dev server, assume backend is local 8000
    if (window.location.port === '5173') {
        API = `http://${window.location.hostname}:8000`
    } else {
        // If built and served by backend or tunneled, use the current origin
        API = window.location.origin
    }
}
export default API

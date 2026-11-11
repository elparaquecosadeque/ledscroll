// Cloudflare Worker: serves the GitHub Pages build at <your domain>/ledscroll/.
// Routes: oficinamentaldebruno.com/ledscroll* and gerardoleon.dev/ledscroll*
// GitHub Pages stays the only deploy; this just forwards requests and keeps visitors on your domain.
const ORIGIN = 'https://elparaquecosadeque.github.io'

export default {
  async fetch(request) {
    const url = new URL(request.url)
    // Relative asset paths need the trailing slash.
    if (url.pathname === '/ledscroll') return Response.redirect(`${url.origin}/ledscroll/${url.search}`, 301)

    const headers = new Headers(request.headers)
    headers.delete('host')
    const upstream = await fetch(ORIGIN + url.pathname + url.search, {
      method: request.method,
      headers,
      redirect: 'manual',
    })
    const response = new Response(upstream.body, upstream)
    // GitHub's own redirects point at github.io; keep them on this domain.
    const location = response.headers.get('location')
    if (location?.startsWith(ORIGIN)) response.headers.set('location', url.origin + location.slice(ORIGIN.length))
    return response
  },
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['api.telegram.org'], // Добавьте домены, с которых разрешено загружать изображения
  },
}

export default nextConfig

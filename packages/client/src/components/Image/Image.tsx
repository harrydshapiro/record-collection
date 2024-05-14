export function Image ({ src, title }: { src: string, title: string }) {
  return <img alt={title} src={src}></img>
}
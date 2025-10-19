import { Badge } from '@/components/ui/badge'

const Header = () => {
  return (
    <header className="text-center space-y-2 mb-8">
      <h1 className="text-4xl font-bold">Dennis Williams</h1>
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <Badge variant="secondary">CTO</Badge>
        <Badge variant="secondary">Tech Leader</Badge>
        <Badge variant="secondary">Software Engineer</Badge>
      </div>
    </header>
  )
}

export default Header

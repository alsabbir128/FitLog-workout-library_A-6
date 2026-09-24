import { DetailPage } from '@/components/fitlog-app'
export default async function Page({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <DetailPage id={id} /> }

import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'IDEA 교육과정 탐색 도우미',description:'수업 아이디어, 교육과정에서 시작해요. 대학생 선생님을 위한 공식 원문 기반 교육과정 탐색과 분석.',icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ko"><body>{children}</body></html>}

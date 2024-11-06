import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type MarkdownRendererProps = {
	content: string
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
	return (
		<div className='max-h-[70vh] overflow-y-auto"'>
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				components={{
					// h1タグに対応
					h1: ({ node, ...props }) => (
						<h1 className="text-gray-700 text-3xl font-extrabold my-4" {...props} />
					),
					// h2タグに対応
					h2: ({ node, ...props }) => (
						<h2 className="text-gray-700 text-2xl font-bold my-3" {...props} />
					),
					// h3タグに対応
					h3: ({ node, ...props }) => (
						<h2 className="text-gray-700 text-xl font-bold my-2" {...props} />
					),
					// h3タグに対応
					h4: ({ node, ...props }) => (
						<h2 className="text-gray-700 text-lg font-bold my-2" {...props} />
					),
					// pタグに対応
					p: ({ node, ...props }) => (
						<p className="text-gray-700 text-base leading-7 my-2" {...props} />
					),
					// ulタグに対応
					ul: ({ node, ...props }) => (
						<ul className="text-gray-700 list-disc ml-5 my-2" {...props} />
					),
					// olタグに対応
					ol: ({ node, ...props }) => (
						<ol className="text-gray-700 list-decimal ml-5 my-2" {...props} />
					),
					// liタグに対応
					li: ({ node, ...props }) => <li className="text-gray-700 my-1" {...props} />,
					// blockquoteタグに対応
					blockquote: ({ node, ...props }) => (
						<blockquote className="border-l-4 border-gray-500 pl-4 italic my-4" {...props} />
					),
					// aタグ（リンク）に対応
					a: ({ node, ...props }) => <a className="text-blue-600 hover:underline" {...props} />,
				}}
			>
				{content}
			</ReactMarkdown>
		</div>
	)
}

export default MarkdownRenderer

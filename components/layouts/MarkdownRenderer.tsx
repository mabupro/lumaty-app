import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type MarkdownRendererProps = {
	content: string
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
	return (
		<ReactMarkdown
			remarkPlugins={[remarkGfm]}
			components={{
				h2: ({ node, ...props }) => <h2 className="text-2xl font-bold" {...props} />,
				code: ({ node, ...props }) => (
					<pre className="bg-gray-100 p-2 rounded">
						<code className="text-sm" {...props} />
					</pre>
				),
			}}
		>
			{content}
		</ReactMarkdown>
	)
}

export default MarkdownRenderer

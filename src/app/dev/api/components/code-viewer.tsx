import { Textarea } from '@/components/ui/textarea';
import ReactJson from 'react-json-view';

export function CodeViewer({ code }) {
  const json = code ? JSON.parse(code) : {};

  return (
    <div className="relative">
      <Textarea 
        disabled={true} 
        value={code}
        rows={10}
        className="text-transparent" // Make the text transparent
      />
      <div className="absolute top-0 left-0 right-0 bottom-0 overflow-auto">
        <ReactJson 
          src={json} 
          theme="monokai" 
          collapsed={false} 
          enableClipboard={false} 
          displayDataTypes={false} 
          style={{ padding: '10px', backgroundColor: 'transparent', borderRadius: '4px', height: '100%' }}
        />
      </div>
    </div>
  );
}

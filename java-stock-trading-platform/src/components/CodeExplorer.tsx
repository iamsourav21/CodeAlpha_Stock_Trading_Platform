import React, { useState } from 'react';
import { INITIAL_JAVA_FILES } from '../data/javaCodeData';
import { JavaSourceFile } from '../types';
import { Folder, FileCode, Copy, Check, Download, Search, Cpu } from 'lucide-react';

export const CodeExplorer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<JavaSourceFile>(INITIAL_JAVA_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activePackageFilter, setActivePackageFilter] = useState<string>('all');

  const packages = Array.from(new Set(INITIAL_JAVA_FILES.map(f => f.package)));

  const filteredFiles = INITIAL_JAVA_FILES.filter(file => {
    const matchesPackage = activePackageFilter === 'all' || file.package === activePackageFilter;
    const matchesSearch = searchQuery === '' ||
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPackage && matchesSearch;
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([selectedFile.code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = selectedFile.name;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
      {/* File Tree Sidebar */}
      <div className="lg:col-span-4 bg-[#1E293B] text-slate-200 rounded-xl p-4 border border-slate-700 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm flex items-center gap-2 text-blue-400">
            <Folder className="w-4 h-4" /> Java Project Explorer
          </h3>
          <span className="text-[10px] font-mono bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">
            {INITIAL_JAVA_FILES.length} Files
          </span>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search classes or code..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-[#0F172A] border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-slate-200 outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap gap-1 text-[11px]">
          <button
            onClick={() => setActivePackageFilter('all')}
            className={`px-2 py-0.5 rounded ${activePackageFilter === 'all' ? 'bg-blue-600 text-white font-bold' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
          >
            All Packages
          </button>
          {packages.map(pkg => {
            const shortName = pkg.replace('com.stocktrading.', '');
            return (
              <button
                key={pkg}
                onClick={() => setActivePackageFilter(pkg)}
                className={`px-2 py-0.5 rounded ${activePackageFilter === pkg ? 'bg-blue-600 text-white font-bold' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
              >
                .{shortName}
              </button>
            );
          })}
        </div>

        <div className="space-y-1 max-h-[460px] overflow-y-auto pr-1">
          {filteredFiles.map(file => (
            <button
              key={file.path}
              onClick={() => setSelectedFile(file)}
              className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors flex items-center justify-between group ${
                selectedFile.path === file.path
                  ? 'bg-blue-600/20 border border-blue-500/40 text-blue-300 font-semibold'
                  : 'bg-slate-800/40 hover:bg-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <FileCode className={`w-4 h-4 flex-shrink-0 ${selectedFile.path === file.path ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'}`} />
                <div className="truncate">
                  <div className="truncate">{file.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{file.package}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Code Viewer */}
      <div className="lg:col-span-8 bg-[#1E293B] text-slate-100 rounded-xl border border-slate-700 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-700 bg-[#0F172A] flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-blue-400">{selectedFile.name}</span>
              <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                {selectedFile.package}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{selectedFile.description}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1.5 font-medium border border-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Code'}
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center gap-1.5 font-semibold shadow"
            >
              <Download className="w-3.5 h-3.5" /> Download .java
            </button>
          </div>
        </div>

        <div className="px-4 py-2 border-b border-slate-700 bg-[#1E293B] flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-400 text-[11px] font-semibold flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-purple-400" /> OOP Concepts:
          </span>
          {selectedFile.oopConcepts.map(concept => (
            <span key={concept} className="px-2 py-0.5 rounded text-[10px] font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20 whitespace-nowrap">
              {concept}
            </span>
          ))}
        </div>

        <div className="p-4 flex-1 overflow-auto bg-[#0F172A] font-mono text-xs leading-relaxed">
          <pre className="text-slate-300">
            {selectedFile.code.split('\n').map((line, idx) => (
              <div key={idx} className="table-row hover:bg-slate-800/50">
                <span className="table-cell select-none pr-4 text-right text-slate-600 text-[10px] w-10">
                  {idx + 1}
                </span>
                <span className="table-cell whitespace-pre">{line}</span>
              </div>
            ))}
          </pre>
        </div>
      </div>
    </div>
  );
};

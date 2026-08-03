import React, { useState } from 'react';
import { BookOpen, Terminal, CheckCircle, Code2, Download, ExternalLink } from 'lucide-react';

export const JavaDocGuide: React.FC = () => {
  const [activeIde, setActiveIde] = useState<'intellij' | 'eclipse' | 'terminal' | 'maven'>('intellij');

  return (
    <div className="space-y-6">
      {/* IDE Setup Guide Header */}
      <div className="p-6 rounded-xl bg-[#1E293B] border border-slate-700 text-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base flex items-center gap-2 text-blue-400">
              <Terminal className="w-5 h-5" /> IDE Setup & Execution Instructions
            </h3>
            <p className="text-xs text-slate-400 mt-1">Step-by-step instructions to import, compile, and execute in IntelliJ IDEA, Eclipse, Maven, or Command Line.</p>
          </div>
        </div>

        {/* IDE Selector Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-700">
          {[
            { id: 'intellij', label: 'IntelliJ IDEA' },
            { id: 'eclipse', label: 'Eclipse IDE' },
            { id: 'maven', label: 'Maven Build (mvn)' },
            { id: 'terminal', label: 'Command Line (javac)' }
          ].map(ide => (
            <button
              key={ide.id}
              onClick={() => setActiveIde(ide.id as any)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
                activeIde === ide.id ? 'bg-blue-600 text-white shadow' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {ide.label}
            </button>
          ))}
        </div>
      </div>

      {/* Guide Content Panel */}
      <div className="p-6 bg-[#1E293B] border border-slate-700 rounded-xl space-y-4 text-xs">
        {activeIde === 'intellij' && (
          <div className="space-y-4 text-slate-300">
            <h4 className="font-bold text-sm text-blue-400 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Running in IntelliJ IDEA
            </h4>
            <ol className="list-decimal list-inside space-y-2 leading-relaxed">
              <li>Open IntelliJ IDEA and click <strong className="text-white">Open...</strong> or <strong className="text-white">File -&gt; Open</strong>.</li>
              <li>Select the root directory containing the <code className="text-blue-300 font-mono">pom.xml</code> file inside <code className="text-blue-300 font-mono">java_src</code>.</li>
              <li>IntelliJ will automatically detect Maven and import dependencies (<code className="text-blue-300 font-mono">flatlaf</code>, <code className="text-blue-300 font-mono">mysql-connector-j</code>).</li>
              <li>Ensure Project SDK is set to <strong className="text-white">Java 17 or higher</strong> under <strong className="text-white">File -&gt; Project Structure -&gt; Project</strong>.</li>
              <li>Navigate to <code className="text-blue-300 font-mono">src/main/java/com/stocktrading/main/Main.java</code> in the Project tool window.</li>
              <li>Right-click <code className="text-blue-300 font-mono">Main.java</code> and select <strong className="text-emerald-400">Run 'Main.main()'</strong>.</li>
            </ol>
          </div>
        )}

        {activeIde === 'eclipse' && (
          <div className="space-y-4 text-slate-300">
            <h4 className="font-bold text-sm text-blue-400 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Running in Eclipse IDE
            </h4>
            <ol className="list-decimal list-inside space-y-2 leading-relaxed">
              <li>Open Eclipse and select <strong className="text-white">File -&gt; Import... -&gt; Maven -&gt; Existing Maven Projects</strong>.</li>
              <li>Browse to the directory containing <code className="text-blue-300 font-mono">pom.xml</code> and click <strong className="text-white">Finish</strong>.</li>
              <li>Right-click the imported project in Package Explorer and choose <strong className="text-white">Properties -&gt; Java Compiler</strong> and set compliance level to <strong className="text-white">17</strong>.</li>
              <li>Locate <code className="text-blue-300 font-mono">Main.java</code> under <code className="text-blue-300 font-mono">com.stocktrading.main</code> package.</li>
              <li>Right-click <code className="text-blue-300 font-mono">Main.java</code> -&gt; <strong className="text-emerald-400">Run As -&gt; Java Application</strong>.</li>
            </ol>
          </div>
        )}

        {activeIde === 'maven' && (
          <div className="space-y-4 text-slate-300">
            <h4 className="font-bold text-sm text-blue-400 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Running with Apache Maven
            </h4>
            <div className="space-y-2 font-mono">
              <div className="p-3 bg-slate-950 rounded border border-slate-800 text-emerald-400 text-xs">
                # 1. Compile source files<br />
                mvn clean compile<br /><br />
                # 2. Run Main application class<br />
                mvn exec:java -Dexec.mainClass="com.stocktrading.main.Main"<br /><br />
                # 3. Package executable JAR file<br />
                mvn package
              </div>
            </div>
          </div>
        )}

        {activeIde === 'terminal' && (
          <div className="space-y-4 text-slate-300">
            <h4 className="font-bold text-sm text-blue-400 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Compiling from Terminal / Command Line (javac)
            </h4>
            <div className="space-y-2 font-mono">
              <div className="p-3 bg-slate-950 rounded border border-slate-800 text-emerald-400 text-xs">
                # Navigate to java_src folder<br />
                cd java_src<br /><br />
                # Compile all package classes into output directory 'bin'<br />
                javac -d bin -sourcepath src/main/java src/main/java/com/stocktrading/main/Main.java<br /><br />
                # Run application<br />
                java -cp bin com.stocktrading.main.Main
              </div>
            </div>
          </div>
        )}
      </div>

      {/* JavaDoc Summary Box */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
        <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-400" /> Generating JavaDoc Documentation
        </h4>
        <p className="text-xs text-slate-400 leading-relaxed">
          All Java classes, interfaces, and methods in this project include full standard JavaDoc comments (<code className="text-blue-300">/** ... */</code>).
          You can generate HTML documentation using the following command:
        </p>
        <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg font-mono text-xs text-emerald-400">
          javadoc -d docs -sourcepath src/main/java -subpackages com.stocktrading
        </div>
      </div>
    </div>
  );
};

import './App.css'
import { FieldCanvas } from './components/field/FieldCanvas'
import { Field } from './components/field/Field'
import { HeaderToolbar } from './components/toolbar/HeaderToolbar'
import { BottomToolbar } from './components/toolbar/BottomToolbar'

function App(): JSX.Element {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      {/* Logo */}
      <div className="absolute top-4 left-4 z-50">
        <h1 className="text-xl font-bold text-white">CoachSync</h1>
      </div>

      {/* Header Toolbar */}
      <HeaderToolbar />

      {/* Main Content - Field Canvas Container */}
      <div className="flex-1 flex items-center justify-center bg-gray-900 min-h-0">
        <div className="relative w-[1000px] h-[569px] mt-12">
          <FieldCanvas width={1000} height={569}>
            <Field width={1000} height={569} />
          </FieldCanvas>
          <BottomToolbar />
        </div>
      </div>
    </div>
  )
}

export default App

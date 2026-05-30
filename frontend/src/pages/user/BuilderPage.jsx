// BuilderPage
import PizzaBuilderWizard from '@/components/pizza/PizzaBuilderWizard'
export default function BuilderPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl mb-1">Build Your <span className="text-brand">Pizza</span></h1>
        <p className="text-[#a89f94] text-sm">Customise every layer of your perfect pie</p>
      </div>
      <PizzaBuilderWizard />
    </div>
  )
}

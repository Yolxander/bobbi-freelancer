const workflowSteps = [
    { id: 'profile', name: 'Build Your Profile', color: 'bg-[#D1FF75]' },
    { id: 'client', name: 'Client Intake', color: 'bg-[#965EF5]' },
    { id: 'project', name: 'Project Management', color: 'bg-black' },
  ]
  
  export function WorkflowSteps() {
    return (
      <div className="flex gap-4 mb-16">
        {workflowSteps.map((step, index) => (
          <div 
            key={step.id}
            className={`flex-1 ${step.color} rounded-2xl p-6 text-lg font-medium ${
              step.color === 'bg-black' ? 'text-white' : 'text-black'
            } flex items-center justify-between group hover:opacity-90 transition-opacity cursor-pointer`}
          >
            {step.name}
            <svg 
              className={`w-6 h-6 ${index === workflowSteps.length - 1 ? 'opacity-0' : ''}`} 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor"
            >
              <path d="M5 12h14m-7-7l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        ))}
      </div>
    )
  }
 
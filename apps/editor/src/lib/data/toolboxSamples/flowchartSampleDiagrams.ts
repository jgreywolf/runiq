import type { SampleCategory } from '../sample-data';

export const flowchartSampleDiagrams: SampleCategory[] = [
	{
		id: 'flowcharts',
		label: 'Flowcharts',
		samples: [
			{
				name: 'Simple Process Flow',
				description: 'Basic process with decision',
				code: `diagram "Process Flow" {

shape start as @stadium label:"Start"
shape process1 as @rectangle label:"Process Data"
shape decision as @rhombus label:"Valid?"
shape process2 as @rectangle label:"Save"
shape end as @stadium label:"End"

start -> process1
process1 -> decision
decision -Yes-> process2
decision -No-> end
process2 -> end}`
			},
			{
				name: 'User Login Flow',
				description: 'Authentication workflow with error handling',
				code: `diagram "User Login" {

shape start as @stadium label:"Start"
shape input as @parallelogram label:"Enter Credentials"
shape validate as @rhombus label:"Valid?"
shape checkAttempts as @rhombus label:"Attempts < 3?"
shape success as @rectangle label:"Grant Access"
shape lockout as @rectangle label:"Lock Account"
shape end as @stadium label:"End"

start -> input
input -> validate
validate -Yes-> success
validate -No-> checkAttempts
checkAttempts -Yes-> input
checkAttempts -No-> lockout
success -> end
lockout -> end}`
			},
			{
				name: 'Document Approval',
				description: 'Multi-step approval process',
				code: `diagram "Document Approval" {

shape submit as @stadium label:"Submit"
shape review as @rectangle label:"Manager Review"
shape approved as @rhombus label:"Approved?"
shape director as @rectangle label:"Director Review"
shape finalApproval as @rhombus label:"Final Approval?"
shape archive as @document label:"Archive"
shape reject as @rectangle label:"Reject"
shape end as @stadium label:"End"

submit -> review
review -> approved
approved -Yes-> director
approved -No-> reject
director -> finalApproval
finalApproval -Yes-> archive
finalApproval -No-> reject
archive -> end
reject -> end}`
			},
			{
				name: 'Data Processing Loop',
				description: 'Iterative data processing with loop',
				code: `diagram "Data Processing" {

shape start as @stadium label:"Start"
shape loadData as @parallelogram label:"Load Data"
shape processRecord as @rectangle label:"Process Record"
shape hasMore as @rhombus label:"More Records?"
shape save as @cylinder label:"Save Results"
shape end as @stadium label:"End"

start -> loadData
loadData -> processRecord
processRecord -> hasMore
hasMore -Yes-> processRecord
hasMore -No-> save
save -> end}`
			}
		]
	}
];

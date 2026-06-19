import Card from './components/Card'

function AccountClass() {
  return (
    <>
    
    <span className='text-[13px] text-[#6B7280] font-normal'>Organize ledgers into structured finance categories</span>
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <div className='xl:col-span-3'>
       <Card 
       count={9}
       description='Total Classes'
       countColor='#0B4D8C'
       />
       
    
       </div>
       <div className='xl:col-span-3'>
       <Card 
       count={8}
       description='Active Classes'
       countColor='#22C55E'
       />
       
        </div>
        <div className='xl:col-span-3'>
        <Card 
       count={120}
       description='Linked Ledgers'
       countColor='#21B6A8'
       />
       
        </div>
        <div className='xl:col-span-3'>
       <Card 
       count={9}
       description='Recently Updated'
       countColor='#F59E0B'
       />
         </div>
    </div>
    
    </>
  )
}

export default AccountClass
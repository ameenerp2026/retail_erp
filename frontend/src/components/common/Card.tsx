
type cardProps={
    count: number,
    description: string,
    countColor : string
}
function Card({count, description, countColor}: cardProps) {
  return (
    <>
      <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-3" >
        <span className={`text-[28px]  font-extrabold text-[${countColor}]`}>
            {count}
        </span>
        <p className="text-[12px] text-[#6B7280]">{description}</p>
        </div>
    </>
  )
}

export default Card
type YesNoBadgeProps = {
  value: boolean
}

export default function YesNoBadge({ value }: YesNoBadgeProps) {
  if (!value) return <div className="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
<path d="M14.6502 5.4939H7.32495C4.29076 5.4939 1.83105 7.9536 1.83105 10.9878C1.83105 14.022 4.29076 16.4817 7.32495 16.4817H14.6502C17.6844 16.4817 20.1441 14.022 20.1441 10.9878C20.1441 7.9536 17.6844 5.4939 14.6502 5.4939Z" stroke="#9CA3AF" stroke-width="1.8313" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M7.32544 12.8191C8.33684 12.8191 9.15674 11.9992 9.15674 10.9878C9.15674 9.9764 8.33684 9.15649 7.32544 9.15649C6.31404 9.15649 5.49414 9.9764 5.49414 10.9878C5.49414 11.9992 6.31404 12.8191 7.32544 12.8191Z" stroke="#9CA3AF" stroke-width="1.8313" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
<span className="text-sm text-[#9CA3AF] font-semibold">No</span></div>

  return (
    <div className="flex items-center gap-2">
      {/* Filled pill switch */}
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M14.6502 5.4939H7.32495C4.29076 5.4939 1.83105 7.9536 1.83105 10.9878C1.83105 14.022 4.29076 16.4817 7.32495 16.4817H14.6502C17.6844 16.4817 20.1441 14.022 20.1441 10.9878C20.1441 7.9536 17.6844 5.4939 14.6502 5.4939Z" stroke="#22C55E" stroke-width="1.8313" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M14.6506 12.8191C15.662 12.8191 16.4819 11.9992 16.4819 10.9878C16.4819 9.9764 15.662 9.15649 14.6506 9.15649C13.6392 9.15649 12.8193 9.9764 12.8193 10.9878C12.8193 11.9992 13.6392 12.8191 14.6506 12.8191Z" stroke="#22C55E" stroke-width="1.8313" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span className="text-sm text-[#00A63E] font-semibold">Yes</span>
    </div>
  )
}
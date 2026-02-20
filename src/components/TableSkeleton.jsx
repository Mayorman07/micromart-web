/**
 * TableSkeleton Component
 * Renders a pulsing placeholder to improve perceived performance during data fetching.
 */
const TableSkeleton = ({ rows = 5, columns = 5 }) => {
    return (
        <>
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <tr key={rowIndex} className="border-b border-white/5 animate-pulse">
                    {Array.from({ length: columns }).map((_, colIndex) => (
                        <td key={colIndex} className="p-6">
                            {/* Simulate Avatar + Text for the first column */}
                            {colIndex === 0 ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-800/50"></div>
                                    <div className="h-4 w-32 bg-slate-800/50 rounded-md"></div>
                                </div>
                            ) : 
                            /* Simulate a Button for the last column */
                            colIndex === columns - 1 ? (
                                <div className="h-8 w-24 bg-slate-800/50 rounded-xl ml-auto"></div>
                            ) : 
                            /* Simulate standard text for middle columns */
                            (
                                <div className="h-4 w-20 bg-slate-800/50 rounded-md mx-auto"></div>
                            )}
                        </td>
                    ))}
                </tr>
            ))}
        </>
    );
};

export default TableSkeleton;
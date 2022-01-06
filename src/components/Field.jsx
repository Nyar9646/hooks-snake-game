import React from "react";

const Field = ({ fields, ids }) => {
    let key = 1

    return (
        <div className="field">
            {
                fields.map(row => {
                    return row.map(col => {
                        key++
                        return <div key={key} className={`dots ${col}`}></div>
                    })
                })
            }
        </div>
    )
}

export default Field

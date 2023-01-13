import { RadioButton } from "primereact/radiobutton";
import "./RadioButtonGroup.scss";
import { useIntl } from "react-intl";

export default function RadioButtonGroup({options, value, setValue, labelId, className, orientation}:any){
    const intl = useIntl();


    return(
        <div className={`flexible--column radioBtnGContainer ${className}`}>
            {labelId && <p className="radioButtonLabel">{intl.formatMessage({id: labelId})}:</p>}
            <div className={`flexible--${orientation}Wrap optionsContainer`}>
                {options.map((op:any, ind:number)=>{
                    return <div className="field-radiobutton flexible--row" key={`${op.label}-${ind}`}>
                                
                                {op.captions && <label htmlFor={`${labelId}${ind}`} className="radioButtonLabel">{op.captions}:</label>}

                                <RadioButton  inputId={`${labelId}${ind}`} name={labelId} value={op.label} onChange={(e) => setValue(e.value)} checked={value === op.label} />

                                <label htmlFor={`${labelId}${ind}`}>{op.label}</label>
                            </div>
                })}
            </div>
            
        </div>
    );
}
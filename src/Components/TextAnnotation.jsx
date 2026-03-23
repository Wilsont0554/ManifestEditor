function TextAnnotation(props){

    const { count, setcount, object} = props;

    
    return(<>
        <div className="field-group">
                <label>Type </label>
                <input
                    placeholder="Input Annotation..."
                    value={object.getBodyValue() || ""} 
                    type="text"
                    onChange={(e) => {object.setBodyValue(e.target.value); setcount(count + 1);}}
                ></input>
        </div>

        <div>
            <h4>Position</h4>
            <div className="field-group">
                <label>X</label>
                <input
                    placeholder="0"
                    type="number"
                    value={object.getTarget().getX()} 
                    onChange={(e) => {
                        object.setX(Number(e.target.value));
                        setcount(count + 1);
                    }}
                />
            </div>
            <div className="field-group">
                <label>Y</label>
                <input
                    placeholder="0"
                    type="number"
                    value={object.getTarget().getY()} 
                    onChange={(e) => {
                        object.setY(Number(e.target.value));
                        setcount(count + 1);
                    }}
                />
            </div>
            <div className="field-group">
                <label>Z</label>
                <input
                    placeholder="0"
                    type="number"
                    value={object.getTarget().getZ()} 
                    onChange={(e) => {
                        object.setZ(Number(e.target.value));
                        setcount(count + 1);
                    }}
                />
            </div>
        </div>
    </>)

} export default TextAnnotation;
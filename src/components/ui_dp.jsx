/*
<div className="mainui">
      <Header />
      <div className="ui-display">
        <div className="ui">
          <div className="action">
            <OverlayTrigger placement="bottom" overlay={cameraTooltip}>
              <button onClick={handleCameraClick} className="btn1">
                <IoCameraSharp style={{ fontSize: "2rem" }} />
              </button>
            </OverlayTrigger>
            <OverlayTrigger placement="bottom" overlay={fileUploadTooltip}>
              <button onClick={handleFileUpload} className="btn2">
                <MdFileUpload style={{ fontSize: "2rem" }} />
              </button>
            </OverlayTrigger>
          </div>
          {FileUpload && (
            <div className="media-upload-wrapper">
              <h5>Choose file to upload</h5>
              <div className="upload-wrapper">
                <input type="file" onChange={handleFileSelect} />
                <Button onClick={toggleUpload}>Upload</Button>
              </div>
            </div>
          )}
          {camUpload && (
            <>
              <div className="camera-container">
                <Webcam
                  className="webcam-style"
                  audio={false}
                  screenshotFormat="image/jpeg"
                  ref={webcamRef} // Set ref to access webcam component
                  onUserMedia={() => console.log("User media started")}
                />
                <button onClick={capture}>Capture Photo</button>
              </div>
            </>
          )}
        </div>
        <div style={{ position: "relative" }}>
          {imageSrc && (
            <div className="imageCalibration">
              <h5>Selected Image</h5>
              <img src={imageSrc} alt="Uploaded" />
              {ProcessedImage && (
                <>
                  <h5>Processed Image</h5>

                  <img
                    src={`http://localhost:3000/${ProcessedImage}?${Date.now()}`}
                    alt="Processed"
                  />
                </>
              )}
            </div>
          )}
        </div>
        <div className='form'>
          {imageSrc && (
            <div >
              <Form className="align-left" onSubmit={handleFormSubmit}>
                <Form.Group>
                  <Form.Label className="coin-dia-entry-label">
                    Enter reference value (in mm)
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={CoinDiaEntry}
                    onChange={(e) => setCoinDiaEntry(e.target.value)}
                    placeholder="Enter reference value (in mm)"
                    required
                    className="refvalcls"
                  />
                  <Button
                    className="button"
                    variant="primary"
                    type="submit"
                    disabled={!CoinDiaEntry}
                    onSubmit={handlesubmit}
                  >
                    Calibrate
                  </Button>
                  {Calibrate && <span>{backendText}</span>}
                </Form.Group>
              </Form>
              {ppmm && (
                <div className="values">
                  <div className="value-wrapper">
                    <div className="value-label">Pixels per millimeter</div>
                    <div className="value">{ppmm}</div>
                  </div>
                </div>
              )}
            </div>
          )}
          <div>
          {ppmm && (
            <div>
              <ClusterAnalysis
                uploaded={uploadedImg}
                ppmm={ppmm}
                minAreaValue={minAreaValue}
                maxAreaValue={maxAreaValue}
                cluster={cluster}
                setminAreaValue={setminAreaValue}
                setmaxAreaValue={setmaxAreaValue}
                setcluster={setcluster}
              />
              
              <Process
                calibrate={Calibrate}
                selectedFile={selectedFile}
                cluster={cluster}
                minAreaValue={minAreaValue}
                maxAreaValue={maxAreaValue}
                ProcessedImage={ProcessedImage}
                setProcessedImage={handleProcessedImageUpdate}
                ppmm={ppmm}
              />
             
            </div>
          )}
        </div>
        </div>
        
      </div>
      <Footer />
    </div>*/
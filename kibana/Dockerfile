FROM kibana
RUN /opt/kibana/bin/kibana plugin -i kibana/timelion
RUN rm /opt/kibana/installedPlugins/timelion/timelion.json
COPY timelion.json /opt/kibana/installedPlugins/timelion/timelion.json
